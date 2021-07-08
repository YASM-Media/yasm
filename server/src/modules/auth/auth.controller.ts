import { RegisterGoogleUserDto } from './../../DTOs/auth/registerGoogleUser.dto';
import { RegisterUserDto } from '../../DTOs/auth/registerUser.dto';
import { AuthService } from './auth.service';
import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { User } from 'src/models/user.model';
import { Response } from 'express';
import { LoggedInUser } from 'src/decorators/logged-in-user.decorator';
import { FirebaseAuthGuard } from 'src/guards/firebase-auth.guard';

/**
 * Authentication Controller implementation
 */
@Controller('/auth')
export class AuthController {
  // Injecting Auth Service from context.
  constructor(private readonly authService: AuthService) {}

  /**
   * API Endpoint for User Registration.
   * @param registerUserDto Body for registration API Endpoint
   * @returns Registered User details.
   */
  @Post('/register')
  public async registerUser(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<User> {
    return this.authService.registerUser(registerUserDto);
  }

  /**
   * API Endpoint for Google User Registration.
   * @param registerUserDto Body for registration API Endpoint
   * @returns Registered User details.
   */
  @Post('/register/google')
  public async registerGoogleUser(
    @Body() registerGoogleUserDto: RegisterGoogleUserDto,
  ): Promise<User> {
    return this.authService.registerGoogleUser(registerGoogleUserDto);
  }

  /**
   * API Endpoint for User Delete.
   * @param user User details
   * @param password User password
   * @param response Express Response Object.
   * @returns Response with User details.
   */
  @UseGuards(FirebaseAuthGuard)
  @Post('/delete')
  public async deleteUser(
    @LoggedInUser() user: User,
    @Body('password') password: string,
    @Res() response: Response,
  ): Promise<Response> {
    // Delete the user
    const confirmation = await this.authService.deleteUser(user, password);

    // Unset cookie.
    response.clearCookie('accessToken');

    return response.send(confirmation);
  }
}
