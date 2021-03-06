import { DeletePostDto } from './../../DTOs/posts/deletePost.dto';
import { UpdatePostDto } from './../../DTOs/posts/updatePost.dto';
import { CreatePostDto } from './../../DTOs/posts/createPost.dto';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post as PostModel } from 'src/models/post.model';
import { LoggedInUser } from 'src/decorators/logged-in-user.decorator';
import { User } from 'src/models/user.model';
import { FirebaseAuthGuard } from 'src/guards/firebase-auth.guard';

/**
 * Controller Implementation for posts data.
 */
@Controller('posts')
export class PostsController {
  // Injecting Post Service from Nest Context.
  constructor(private readonly postsService: PostsService) {}

  /**
   * API Endpoint for fetching new posts by followed users.
   * @param user Logged In User
   * @returns New posts by followed users
   */
  @UseGuards(FirebaseAuthGuard)
  @Get('get/new')
  public async getNewPosts(@LoggedInUser() user: User): Promise<PostModel[]> {
    return this.postsService.getNewPosts(user);
  }

  /**
   * API Endpoint for fetching best posts by followed users.
   * @param user Logged In User
   * @returns New posts by followed users
   */
  @UseGuards(FirebaseAuthGuard)
  @Get('get/best')
  public async getBestPostsByDay(
    @LoggedInUser() user: User,
  ): Promise<PostModel[]> {
    return this.postsService.getBestPostsByDay(user);
  }

  /**
   * API Endpoint for fetching posts by a user.
   * @param userId User ID
   * @param user Logged In User Details
   * @returns Posts by the user
   */
  @UseGuards(FirebaseAuthGuard)
  @Get('get/user/:userId')
  public async getPostsByUser(
    @Param('userId') userId: string,
    @LoggedInUser() user: User,
  ): Promise<PostModel[]> {
    return await this.postsService.getPostsByUser(user, userId);
  }

  /**
   * Fetch post by id.
   * @param postId Post ID
   * @returns Post Model Object
   */
  @UseGuards(FirebaseAuthGuard)
  @Get('get/post/:postId')
  public async getPostById(
    @Param('postId') postId: string,
  ): Promise<PostModel> {
    return await this.postsService.getPostById(postId);
  }

  /**
   * API Endpoint for suggested posts.
   * @param user Logged In User
   * @returns Suggested Post array
   */
  @UseGuards(FirebaseAuthGuard)
  @Get('get/suggested')
  public async getSuggestedPosts(
    @LoggedInUser() user: User,
  ): Promise<PostModel[]> {
    return await this.postsService.fetchSuggestedPosts(user);
  }

  /**
   * API Endpoint for Post Creation.
   * @param createPostDto DTO For Post Creation
   * @param user Logged In User
   * @returns Post Model Object
   */
  @UseGuards(FirebaseAuthGuard)
  @Post('create')
  public async createPost(
    @Body() createPostDto: CreatePostDto,
    @LoggedInUser() user: User,
  ): Promise<PostModel> {
    return await this.postsService.createPost(createPostDto, user);
  }

  /**
   * API Endpoint for Post Updating.
   * @param updatePostDto DTO For Post Updating
   * @param user Logged In User
   * @returns Updated Post Model Object
   */
  @UseGuards(FirebaseAuthGuard)
  @Post('update')
  public async updatePost(
    @Body() updatePostDto: UpdatePostDto,
    @LoggedInUser() user: User,
  ): Promise<PostModel> {
    return await this.postsService.updatePost(updatePostDto, user);
  }

  /**
   * API Endpoint for Post Deletion.
   * @param deletePostDto DTO For POst Deletion
   * @param user Logged In User Details
   * @returns Deletion Confirmation
   */
  @UseGuards(FirebaseAuthGuard)
  @Post('delete')
  public async deletePost(
    @Body() deletePostDto: DeletePostDto,
    @LoggedInUser() user: User,
  ): Promise<string> {
    return await this.postsService.deletePost(deletePostDto, user);
  }
}
