import { UpdatePostDto } from './../../DTOs/posts/updatePost.dto';
import { CreatePostDto } from './../../DTOs/posts/createPost.dto';
import { JwtAuthGuard } from './../../guards/auth.guard';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
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
}
