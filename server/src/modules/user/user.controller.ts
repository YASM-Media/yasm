import { FirebaseAuthGuard } from './../../guards/firebase-auth.guard';
import { EmailUpdateDto } from '../../DTOs/user/emailUpdate.dto';
import { UserService } from 'src/modules/user/user.service';
import { ProfileDto } from '../../DTOs/user/profile.dto';
import { User } from 'src/models/user.model';
import { LoggedInUser } from './../../decorators/logged-in-user.decorator';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

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
  ): Promise<String> {
    await this.userService.updateEmailAddress(user, emailUpdateDto);

    return 'OK';
  }
}
