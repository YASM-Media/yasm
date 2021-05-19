import { FollowService } from './follow.service';
import { JwtAuthGuard } from './../../guards/auth.guard';
import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { LoggedInUser } from 'src/decorators/logged-in-user.decorator';
import { User } from 'src/models/user.model';

/**
 * Follow API Controller Implementation
 */
@Controller('follow-api')
export class FollowController {
  // Injecting Follow Service from the context.
  constructor(private readonly followService: FollowService) {}

  /**
   * API Endpoint for Following a user.
   * @param user Logged In User Details
   * @param id ID of the user to follow
   * @returns User object with follow details
   */
  @UseGuards(JwtAuthGuard)
  @Post('follow/:id')
  public async followUser(
    @LoggedInUser() user: User,
    @Param('id') id: string,
  ): Promise<User> {
    return await this.followService.followUser(user, id);
  }

  /**
   * API Endpoint for unfollowing a user.
   * @param user Logged In User Details
   * @param id ID of the user to unfollow
   * @returns User object with follow details
   */
  @UseGuards(JwtAuthGuard)
  @Post('unfollow/:id')
  public async unfollowUser(
    @LoggedInUser() user: User,
    @Param('id') id: string,
  ): Promise<User> {
    return await this.followService.unfollowUser(user, id);
  }

  /**
   * API Endpoint to get logged in user follow details.
   * @param user Logged In User Details
   * @returns User object with follow details
   */
  @UseGuards(JwtAuthGuard)
  @Get('get')
  public async getFollowersAndFollowing(
    @LoggedInUser() user: User,
  ): Promise<User> {
    return await this.followService.getFollowersAndFollowing(user);
  }

  /**
   * API Endpoint to get given user follow details.
   * @param id ID of the user for details.
   * @returns User object with follow details
   */
  @UseGuards(JwtAuthGuard)
  @Get('get/:id')
  public async getFollowersAndFollowingForUser(
    @Param('id') id: string,
  ): Promise<User> {
    return await this.followService.getFollowersAndFollowingForUser(id);
  }
}
