import { LikeService } from './like.service';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { LikeDto } from 'src/DTOs/like/like.dto';
import { LoggedInUser } from 'src/decorators/logged-in-user.decorator';
import { User } from 'src/models/user.model';
import { Like } from 'src/models/like.model';

/**
 * Controller Implementation for Likes
 */
@Controller('like-api')
export class LikeController {
  // Injecting Like Service from Nest Context.
  constructor(private readonly likeService: LikeService) {}

  /**
   * API Endpoint for liking post.
   * @param likeDto DTO For Like
   * @param user Logged In User
   * @returns Like Model Object
   */
  @UseGuards(JwtAuthGuard)
  @Post('like')
  public async likePost(
    @Body() likeDto: LikeDto,
    @LoggedInUser() user: User,
  ): Promise<Like> {
    return await this.likeService.likePost(likeDto, user);
  }

  /**
   * API Endpoint for unliking a post.
   * @param likeDto DTO For Like
   * @param user Logged In User
   * @returns Unlike Confirmation
   */
  @UseGuards(JwtAuthGuard)
  @Post('unlike')
  public async unlikePost(
    @Body() likeDto: LikeDto,
    @LoggedInUser() user: User,
  ): Promise<string> {
    return await this.likeService.unlikePost(likeDto, user);
  }
}
