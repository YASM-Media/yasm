import { PasswordUpdateDto } from './../../DTOs/passwordUpdate.dto';
import { EmailUpdateDto } from './../../DTOs/emailUpdate.dto';
import { UserService } from 'src/modules/user/user.service';
import { ProfileDto } from './../../DTOs/profile.dto';
import { JwtAuthGuard } from './../../guards/auth.guard';
import { User } from 'src/models/user.model';
import { LoggedInUser } from './../../decorators/logged-in-user.decorator';
import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

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

  @UseGuards(JwtAuthGuard)
  @Post('update/email')
  public async updateEmailAddress(
    @Body() emailUpdateDto: EmailUpdateDto,
    @LoggedInUser() user: User,
    @Res() response: Response,
  ): Promise<Response> {
    const token = await this.userService.updateEmailAddress(
      user,
      emailUpdateDto,
    );

    response.cookie('accessToken', token.accessToken, {
      sameSite: 'strict',
      httpOnly: true,
    });

    return response.json(token.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('update/password')
  public async updatePassword(
    @Body() passwordUpdateDto: PasswordUpdateDto,
    @LoggedInUser() user: User,
  ): Promise<User> {
    return await this.userService.updatePassword(user, passwordUpdateDto);
  }
}
