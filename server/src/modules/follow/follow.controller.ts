import { FollowService } from './follow.service';
import { JwtAuthGuard } from './../../guards/auth.guard';
import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { LoggedInUser } from 'src/decorators/logged-in-user.decorator';
import { User } from 'src/models/user.model';

@Controller('follow-api')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @UseGuards(JwtAuthGuard)
  @Post('follow/:id')
  public async followUser(
    @LoggedInUser() user: User,
    @Param('id') id: string,
  ): Promise<User> {
    return await this.followService.followUser(user, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('unfollow/:id')
  public async unfollowUser(
    @LoggedInUser() user: User,
    @Param('id') id: string,
  ): Promise<User> {
    return await this.followService.unfollowUser(user, id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get')
  public async getFollowersAndFollowing(
    @LoggedInUser() user: User,
  ): Promise<User> {
    return await this.followService.getFollowersAndFollowing(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get/:id')
  public async getFollowersAndFollowingForUser(
    @Param('id') id: string,
  ): Promise<User> {
    return await this.followService.getFollowersAndFollowingForUser(id);
  }
}
