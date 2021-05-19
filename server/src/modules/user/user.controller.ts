import { UserService } from 'src/modules/user/user.service';
import { ProfileDto } from './../../DTOs/profile.dto';
import { JwtAuthGuard } from './../../guards/auth.guard';
import { User } from 'src/models/user.model';
import { LoggedInUser } from './../../decorators/logged-in-user.decorator';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  public getLoggedInUser(@LoggedInUser() user: User): User {
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('update/profile')
  public async updateUserProfile(
    @Body() profileDto: ProfileDto,
    @LoggedInUser() user: User,
  ): Promise<User> {
    return await this.userService.updateUserProfile(user, profileDto);
  }
}
