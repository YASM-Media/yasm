import { CreatePostDto } from '../../DTOs/posts/createPost.dto';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/models/post.model';
import { EntityNotFoundError, Repository } from 'typeorm';
import { Image } from 'src/models/image.model';
import { User } from 'src/models/user.model';
import { UpdatePostDto } from 'src/DTOs/posts/updatePost.dto';

/**
 * Service Implementation for Posts.
 */
@Injectable()
export class PostsService {
  // Injecting Post and Image Repositories from Nest Context.
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {}

  /**
   * Fetch one post for the given id
   * @param postId ID for the post
   * @returns Post Database Object
   */
  public async getPost(postId: string, user: User): Promise<Post> {
    // Find one post for the given id.
    return await this.postRepository.findOneOrFail({ id: postId, user: user });
  }

  /**
   * Save a new post to the database.
   * @param createPostDto DTO For Post Creation
   * @Param user Logged In User Details
   */
  public async createPost(
    createPostDto: CreatePostDto,
    user: User,
  ): Promise<Post> {
    // Create Image model and save it to the database out of the URLs.
    const modelImages: Image[] = await Promise.all(
      createPostDto.images.map(async (imageLink) => {
        const imageModel = new Image();
        imageModel.imageUrl = imageLink;

        return await this.imageRepository.save(imageModel);
      }),
    );

    // Create and assign values to post model.
    const postModel = new Post();
    postModel.text = createPostDto.text;
    postModel.images = modelImages;
    postModel.user = user;

    // Save the post to the database and return to the User.
    return await this.postRepository.save(postModel);
  }

  /**
   * Update a given post.
   * @param createOrUpdatePostDto DTO For Post Updating
   * @param user Logged In User Details
   */
  public async updatePost(
    updatePostDto: UpdatePostDto,
    user: User,
  ): Promise<Post> {
    try {
      // Fetch the model for the given post ID.
      const postModel = await this.getPost(updatePostDto.id, user);

      // Delete all images related to this specific post.
      await this.imageRepository.delete({
        post: postModel,
      });

      // Reinsert old/new images to the database and get their models.
      const imageModels: Image[] = await Promise.all(
        updatePostDto.images.map(async (imageLink) => {
          const imageModel = new Image();
          imageModel.imageUrl = imageLink;

          return await this.imageRepository.save(imageModel);
        }),
      );

      // Update the post model object.
      postModel.text = updatePostDto.text;
      postModel.images = imageModels;

      // Save the updated model.
      return await this.postRepository.save(postModel);
    } catch (error) {
      throw new HttpException('Post Not Found', HttpStatus.NOT_FOUND);
    }
  }
}
