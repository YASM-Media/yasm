import { DeleteCommentDto } from './../../DTOs/comments/deleteComment.dto';
import { CreateCommentDto } from './../../DTOs/comments/createComment.dto';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from './../../guards/auth.guard';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { LoggedInUser } from 'src/decorators/logged-in-user.decorator';
import { Post as PostModel } from 'src/models/post.model';
import { User } from 'src/models/user.model';
import { UpdateCommentDto } from 'src/DTOs/comments/updateComment.dto';

/**
 * Controller implementation for Comments Module.
 */
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  /**
   * API Endpoint for fetching best comments.
   * @param postId Post ID
   * @returns Array sorted by best comments
   */
  @UseGuards(JwtAuthGuard)
  @Get('get/best/:id')
  public async fetchBestComments(
    @Param('id') postId: string,
  ): Promise<PostModel[]> {
    return await this.commentsService.fetchBestComments(postId);
  }

  /**
   * API Endpoint for fetching new comments.
   * @param postId Post ID
   * @returns Array sorted by new comments
   */
  @UseGuards(JwtAuthGuard)
  @Get('get/new/:id')
  public async fetchNewComments(
    @Param('id') postId: string,
  ): Promise<PostModel[]> {
    return await this.commentsService.fetchNewComments(postId);
  }

  /**
   * API Endpoint for post creation.
   * @param createPostDto DTO for comments creation
   * @param user Logged In User
   * @returns Saved Post Object.
   */
  @UseGuards(JwtAuthGuard)
  @Post('create')
  public async createComment(
    @Body() createCommentDto: CreateCommentDto,
    @LoggedInUser() user: User,
  ): Promise<PostModel> {
    return await this.commentsService.createComment(createCommentDto, user);
  }

  /**
   * API Endpoint for updating comment.
   * @param updateCommentDto Update Comment DTO
   * @param user Logged In User
   * @returns Updated Comment Model
   */
  @UseGuards(JwtAuthGuard)
  @Post('update')
  public async updateComment(
    @Body() updateCommentDto: UpdateCommentDto,
    @LoggedInUser() user: User,
  ): Promise<PostModel> {
    return await this.commentsService.updateComment(updateCommentDto, user);
  }

  /**
   * API Endpoint for post deletion.
   * @param createPostDto DTO for comments deletion.
   * @returns Updated Post Object.
   */
  @UseGuards(JwtAuthGuard)
  @Post('delete')
  public async deleteComment(
    @Body() deleteCommentDto: DeleteCommentDto,
  ): Promise<string> {
    return await this.commentsService.deleteComment(deleteCommentDto);
  }
}
