import { Token } from './../../types/token.type';
import { RegisterUserDto } from './../../DTOs/registerUser.dto';
import { UserService } from './../user/user.service';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { User } from 'src/models/user.model';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { LoginUserDto } from 'src/DTOs/loginUser.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  public async registerUser(registerUserDto: RegisterUserDto): Promise<User> {
    const saltOrRounds = 10;
    registerUserDto.password = await bcrypt.hash(
      registerUserDto.password,
      saltOrRounds,
    );

    return await this.userService.registerNewUser(registerUserDto);
  }

  public async loginUser(loginUserDto: LoginUserDto): Promise<Token> {
    const user = await this.validateUser(
      loginUserDto.emailAddress,
      loginUserDto.password,
    );

    if (user) {
      const accessPayload = {
        email: user.emailAddress,
      };

      const refreshPayload = {
        token: crypto.randomBytes(20),
      };

      // TODO: STORE REFRESH TOKEN IN DATABASE.

      return {
        accessToken: this.jwtService.sign(accessPayload, { expiresIn: '15m' }),
        refreshToken: this.jwtService.sign(refreshPayload, {
          expiresIn: '7d',
        }),
      };
    } else {
      throw new HttpException(
        'Either email address or password is incorrect',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  public async validateUser(
    emailAddress: string,
    password: string,
  ): Promise<User | null> {
    const checkUser = await this.userService.findOneUserByEmailAddress(
      emailAddress,
    );

    if (checkUser) {
      const checkPassword = await bcrypt.compare(password, checkUser.password);

      if (checkPassword === true) {
        return checkUser;
      } else {
        throw new HttpException(
          'Your password is incorrect',
          HttpStatus.FORBIDDEN,
        );
      }
    }

    throw new HttpException(
      'Account does not exist with the given email address',
      HttpStatus.FORBIDDEN,
    );
  }
}
