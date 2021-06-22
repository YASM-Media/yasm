import { FirebaseAuthGuard } from './../../guards/firebase-auth.guard';
import { PasswordUpdateDto } from './../../DTOs/passwordUpdate.dto';
import { EmailUpdateDto } from './../../DTOs/emailUpdate.dto';
import { UserService } from 'src/modules/user/user.service';
import { ProfileDto } from './../../DTOs/profile.dto';
import { JwtAuthGuard } from './../../guards/auth.guard';
import { User } from 'src/models/user.model';
import { LoggedInUser } from './../../decorators/logged-in-user.decorator';
import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

/**
 * Controller Implementation for User Profile.
 */
@Controller('user')
export class UserController {
  // Injecting in User Service.
  constructor(private readonly userService: UserService) {}

  /**
   * Get the logged in user details.
   * @param user Logged In User Details
   * @returns User Details
   */
  @UseGuards(FirebaseAuthGuard)
  @Get('me')
  public getLoggedInUser(@LoggedInUser() user: User): User {
    return user;
  }

  /**
   * API Endpoint for suggested users.
   * @param user Logged In User
   * @returns Suggested User Details
   */
  @UseGuards(FirebaseAuthGuard)
  @Get('suggested')
  public async fetchSuggestedUsers(
    @LoggedInUser() user: User,
  ): Promise<User[]> {
    return await this.userService.fetchSuggestedUsers(user);
  }

  /**
   * API Endpoint for updating User Profile.
   * @param profileDto User Profile Update DTO
   * @param user Logged In User
   * @returns Updated User Profile
   */
  @UseGuards(FirebaseAuthGuard)
  @Post('update/profile')
  public async updateUserProfile(
    @Body() profileDto: ProfileDto,
    @LoggedInUser() user: User,
  ): Promise<User> {
    return await this.userService.updateUserProfile(user, profileDto);
  }

  /**
   * API Endpoint for User Email Address Update.
   * @param emailUpdateDto User Email Update DTO
   * @param user Logged In User
   * @param response Express Response Object
   * @returns Cookie with token and User details.
   */
  @UseGuards(FirebaseAuthGuard)
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

  /**
   * API Endpoint for User Password Update.
   * @param passwordUpdateDto User Password Update DTO
   * @param user Logged In User
   * @returns User Details with updated details.
   */
  @UseGuards(FirebaseAuthGuard)
  @Post('update/password')
  public async updatePassword(
    @Body() passwordUpdateDto: PasswordUpdateDto,
    @LoggedInUser() user: User,
  ): Promise<User> {
    return await this.userService.updatePassword(user, passwordUpdateDto);
  }
}
