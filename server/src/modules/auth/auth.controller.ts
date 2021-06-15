import { LoginUserDto } from './../../DTOs/loginUser.dto';
import { RegisterUserDto } from './../../DTOs/registerUser.dto';
import { AuthService } from './auth.service';
import { Body, Controller, Post, Res } from '@nestjs/common';
import { User } from 'src/models/user.model';
import { Response } from 'express';
import { Token } from 'src/types/token.type';

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
   * API Endpoint for User Login.
   * @param loginUserDto Body for Login API Endpoint.
   * @param response Express Response Object.
   * @returns Response with User details.
   */
  @Post('/login')
  public async loginUser(
    @Body() loginUserDto: LoginUserDto,
    @Res() response: Response,
  ): Promise<Response> {
    // Get the access token for the user.
    const token: Token = await this.authService.loginUser(loginUserDto);

    // Send the token as a cookie.
    response.cookie('accessToken', token.accessToken, {
      sameSite: 'strict',
      httpOnly: true,
    });

    return response.json(token.user);
  }

  /**
   * API Endpoint for User Logout.
   * @param loginUserDto Body for Login API Endpoint.
   * @param response Express Response Object.
   * @returns Response with User details.
   */
  @Post('/logout')
  public async logoutUser(@Res() response: Response): Promise<Response> {
    // Unset cookie.
    response.clearCookie('accessToken');

    return response.send('OK');
  }
}
