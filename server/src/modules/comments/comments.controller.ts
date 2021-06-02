import { CreateCommentDto } from './../../DTOs/comments/createComment.dto';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from './../../guards/auth.guard';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { LoggedInUser } from 'src/decorators/logged-in-user.decorator';
import { Post as PostModel } from 'src/models/post.model';
import { User } from 'src/models/user.model';

/**
 * Controller implementation for Comments Module.
 */
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  /**
   * API Endpoint for post creation.
   * @param createPostDto DTO for comments creation
   * @param user Logged In User
   * @returns Saved Post Object.
   */
  @UseGuards(JwtAuthGuard)
  @Post('create')
  public async createPost(
    @Body() createCommentDto: CreateCommentDto,
    @LoggedInUser() user: User,
  ): Promise<PostModel> {
    return await this.commentsService.createPost(createCommentDto, user);
  }
}
