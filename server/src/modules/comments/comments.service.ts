import { DeleteCommentDto } from './../../DTOs/comments/deleteComment.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCommentDto } from 'src/DTOs/comments/createComment.dto';
import { Image } from 'src/models/image.model';
import { Post, PostType } from 'src/models/post.model';
import { User } from 'src/models/user.model';
import { Repository } from 'typeorm';
import { PostsService } from '../posts/posts.service';

/**
 * Service implementation for Comments module.
 */
@Injectable()
export class CommentsService {
  // Injecting Post and Image Repositories
  // and Post Service as well.
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,

    private readonly postService: PostsService,
  ) {}

  /**
   * Create and save model to database.
   * @param createPostDto DTO for creating post.
   * @param user Logged In User.
   * @returns Saved post model object.
   */
  public async createComment(
    createCommentDto: CreateCommentDto,
    user: User,
  ): Promise<Post> {
    // Saving all images in database first.
    const commentImages: Image[] = await Promise.all(
      createCommentDto.images.map(async (imageLink) => {
        const imageModel = new Image();
        imageModel.imageUrl = imageLink;

        return await this.imageRepository.save(imageModel);
      }),
    );

    // Create the post model and assign values to it.
    const postModel = new Post();
    postModel.postType = PostType.Comment;
    postModel.user = user;
    postModel.text = createCommentDto.text;
    postModel.post = await this.postService.getPostByIdNormal(
      createCommentDto.postId,
    );
    postModel.images = commentImages;

    // Save the post model to database.
    return await this.postRepository.save(postModel);
  }

  /**
   * Fetch best comments for the given post.
   * @param postId ID for the post
   * @returns Best comments for the post
   */
  public async fetchBestComments(postId: string): Promise<Post[]> {
    return (
      await this.postRepository.find({
        relations: [
          'user',
          'images',
          'likes',
          'likes.user',
          'comments',
          'comments.likes',
          'comments.images',
          'comments.user',
          'comments.likes.user',
        ],
        where: {
          post: await this.postService.getPostByIdNormal(postId),
          postType: PostType.Comment,
        },
      })
    ).sort((firstComment, secondComment) =>
      firstComment.likes.length > secondComment.likes.length ? -1 : 1,
    );
  }

  /**
   * Fetch the newest comments
   * @param postId Post ID
   * @returns New comments in array.
   */
  public async fetchNewComments(postId: string): Promise<Post[]> {
    return await this.postRepository.find({
      relations: [
        'user',
        'images',
        'likes',
        'likes.user',
        'comments',
        'comments.likes',
        'comments.images',
        'comments.user',
        'comments.likes.user',
      ],
      where: {
        postType: PostType.Comment,
        post: await this.postService.getPostByIdNormal(postId),
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  public async deleteComment(
    deleteCommentDto: DeleteCommentDto,
  ): Promise<Post> {
    const post = await this.postService.getPostById(deleteCommentDto.postId);
    post.comments = post.comments.filter(
      (comment) => comment.id !== deleteCommentDto.commentId,
    );

    return await this.postRepository.save(post);
  }
}
