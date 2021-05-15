import { LoginUserDto } from './../../DTOs/loginUser.dto';
import { RegisterUserDto } from './../../DTOs/registerUser.dto';
import { AuthService } from './auth.service';
import { Body, Controller, Post, Res, HttpStatus } from '@nestjs/common';
import { User } from 'src/models/user.model';
import { Response } from 'express';
import { Token } from 'src/types/token.type';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  public async registerUser(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<User> {
    return this.authService.registerUser(registerUserDto);
  }

  @Post('/login')
  public async loginUser(
    @Body() loginUserDto: LoginUserDto,
    @Res() response: Response,
  ): Promise<Response> {
    const token: Token = await this.authService.loginUser(loginUserDto);

    response.cookie('accessToken', token.accessToken, {
      sameSite: 'strict',
      httpOnly: true,
    });

    return response.json(token.user);
  }
}
