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
  public async createPost(
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
    postModel.post = await this.postService.getPostById(
      createCommentDto.postId,
    );
    postModel.images = commentImages;

    // Save the post model to database.
    return await this.postRepository.save(postModel);
  }
}
