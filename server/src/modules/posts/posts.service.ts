import { UserService } from './../user/user.service';
import { DeletePostDto } from './../../DTOs/posts/deletePost.dto';
import { CreatePostDto } from '../../DTOs/posts/createPost.dto';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/models/post.model';
import { In, MoreThanOrEqual, Repository } from 'typeorm';
import { Image } from 'src/models/image.model';
import { User } from 'src/models/user.model';
import { UpdatePostDto } from 'src/DTOs/posts/updatePost.dto';

/**
 * Service Implementation for Posts.
 */
@Injectable()
export class PostsService {
  // Injecting Post and Image Repositories from Nest Context.
  // Also injecting User Service.
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,

    private readonly userService: UserService,
  ) {}

  /**
   * Fetch one post for the given id
   * @param postId ID for the post
   * @returns Post Database Object
   */
  private async getPost(postId: string, user: User): Promise<Post> {
    // Find one post for the given id.
    return await this.postRepository.findOneOrFail({ id: postId, user: user });
  }

  /**
   * Fetch a post for thr given ID.
   * @param postId Post ID
   * @returns Post Model Object
   */
  public async getPostById(postId: string): Promise<Post> {
    return await this.postRepository.findOne({
      id: postId,
    });
  }

  /**
   * Fetch the newest posts by the user followed by the logged in user.
   * @param user Logged In User Details
   * @returns Posts by users followed by Logged In User
   */
  public async getNewPosts(user: User): Promise<Post[]> {
    // Getting all follow details for the logged in user.
    const userFollowDetails =
      await this.userService.findOneUserByIdWithRelations(user.id);

    // Returning all posts, newest first, by the users the logged in user follows
    return await this.postRepository.find({
      relations: ['user', 'images', 'likes', 'likes.user'],
      where: {
        user: In(userFollowDetails.following.map((u) => u.id)),
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  /**
   * Fetch the best posts by the user followed by the
   * logged in user in the last 24 hours.
   * @param user Logged In User Details
   * @returns Posts by users followed by Logged In User
   */
  public async getBestPostsByDay(user: User): Promise<Post[]> {
    // Getting all follow details for the logged in user.
    const userFollowDetails =
      await this.userService.findOneUserByIdWithRelations(user.id);

    // Getting 24 hours earlier date.
    const date = new Date();
    date.setDate(date.getDate() - 1);

    // Returning all posts, best first, by the users the logged in user follows
    return (
      await this.postRepository.find({
        relations: ['user', 'images', 'likes', 'likes.user'],
        where: {
          user: In(userFollowDetails.following.map((u) => u.id)),
          createdAt: MoreThanOrEqual(date),
        },
      })
    ).sort((firstPost, secondPost) =>
      firstPost.likes.length > secondPost.likes.length ? -1 : 1,
    );
  }

  /**
   * Fetch posts by the user.
   * @param user Logged In User
   * @param userId User ID to fetch posts for
   * @returns Posts Array by the user
   */
  public async getPostsByUser(user: User, userId: string): Promise<Post[]> {
    return await this.postRepository.find({
      relations: ['user', 'likes', 'likes.user', 'images'],
      where: {
        user: await this.userService.findOneUserById(userId),
      },
    });
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

  /**
   * Delete the post with the given ID
   * @param deletePostDto DTO For Post Deletion
   * @param user Logged In User Details
   * @returns Deletion Confimation
   */
  public async deletePost(
    deletePostDto: DeletePostDto,
    user: User,
  ): Promise<string> {
    try {
      // Get the post for the logged in user.
      const postModel = await this.getPost(deletePostDto.id, user);

      // Delete all the images related to the post.
      await this.imageRepository.delete({ post: postModel });

      // Delete the post itself.
      await this.postRepository.delete(postModel);

      // Return deletion confirmation.
      return 'OK';
    } catch (error) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
  }
}
