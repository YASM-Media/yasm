import { DeletePostDto } from './../../DTOs/posts/deletePost.dto';
import { UpdatePostDto } from './../../DTOs/posts/updatePost.dto';
import { CreatePostDto } from './../../DTOs/posts/createPost.dto';
import { JwtAuthGuard } from './../../guards/auth.guard';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post as PostModel } from 'src/models/post.model';
import { LoggedInUser } from 'src/decorators/logged-in-user.decorator';
import { User } from 'src/models/user.model';

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
  @UseGuards(JwtAuthGuard)
  @Get('get/new')
  public async getNewPosts(@LoggedInUser() user: User): Promise<PostModel[]> {
    return this.postsService.getNewPosts(user);
  }

  /**
   * API Endpoint for fetching best posts by followed users.
   * @param user Logged In User
   * @returns New posts by followed users
   */
  @UseGuards(JwtAuthGuard)
  @Get('get/best')
  public async getBestPostsByDay(
    @LoggedInUser() user: User,
  ): Promise<PostModel[]> {
    return this.postsService.getBestPostsByDay(user);
  }

  /**
   * API Endpoint for Post Creation.
   * @param createPostDto DTO For Post Creation
   * @param user Logged In User
   * @returns Post Model Object
   */
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  @Post('delete')
  public async deletePost(
    @Body() deletePostDto: DeletePostDto,
    @LoggedInUser() user: User,
  ): Promise<string> {
    return await this.postsService.deletePost(deletePostDto, user);
  }
}
