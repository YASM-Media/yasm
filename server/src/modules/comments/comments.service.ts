import { ActivityService } from './../activity/activity.service';
import { DeleteCommentDto } from './../../DTOs/comments/deleteComment.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCommentDto } from 'src/DTOs/comments/createComment.dto';
import { Image } from 'src/models/image.model';
import { Post, PostType } from 'src/models/post.model';
import { User } from 'src/models/user.model';
import { Repository } from 'typeorm';
import { PostsService } from '../posts/posts.service';
import { UpdateCommentDto } from 'src/DTOs/comments/updateComment.dto';

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
    private readonly activityService: ActivityService,
  ) {}

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
    // Create the post model and assign values to it.

    const post = await this.postService.getPostById(createCommentDto.postId);

    const postModel = new Post();
    postModel.postType = PostType.Comment;
    postModel.user = user;
    postModel.text = createCommentDto.text;
    postModel.post = post;

    // Save the post model to database.
    const savedComment = await this.postRepository.save(postModel);

    await this.activityService.createActivityForComment(post, user);

    // Return the comment.
    return await this.postService.getPostById(savedComment.id);
  }

  /**
   * Update a given comment.
   * @param updateCommentDto DTO For Comment Updating
   * @param user Logged In User Details
   */
  public async updateComment(
    updateCommentDto: UpdateCommentDto,
    user: User,
  ): Promise<Post> {
    try {
      // Fetch the model for the given post ID.
      const postModel = await this.postService.getPost(
        updateCommentDto.id,
        user,
      );

      // Update the post model object.
      postModel.text = updateCommentDto.text;

      // Save the updated model.
      const updated = await this.postRepository.save(postModel);

      return await this.postService.getPostById(updated.id);
    } catch (error) {
      throw new HttpException('Comment Not Found', HttpStatus.NOT_FOUND);
    }
  }

  /**
   * Delete comment from post.
   * @param deleteCommentDto DTO For comment deletion
   * @returns Confirmation
   */
  public async deleteComment(
    deleteCommentDto: DeleteCommentDto,
  ): Promise<string> {
    const post = await this.postService.getPostById(deleteCommentDto.postId);
    post.comments = post.comments.filter(
      (comment) => comment.id !== deleteCommentDto.commentId,
    );

    await this.postRepository.save(post);

    await this.postRepository.delete(
      await this.postService.getPostByIdNormal(deleteCommentDto.commentId),
    );

    return 'OK';
  }
}
