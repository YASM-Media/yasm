import { Token } from './../../types/token.type';
import { RegisterUserDto } from './../../DTOs/registerUser.dto';
import { UserService } from './../user/user.service';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { User } from 'src/models/user.model';
import * as bcrypt from 'bcrypt';
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
      return {
        accessToken: this.jwtService.sign(
          {
            email: user.emailAddress,
            accessTimeLimit: this.getFifteenMinutesLater(),
            refreshTimeLimit: this.getSevenDaysLater(),
          },
          {
            expiresIn: '7d',
          },
        ),
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

  getSevenDaysLater(): Date {
    const date = new Date();
    date.setDate(date.getDate() + 7);

    return date;
  }

  getFifteenMinutesLater(): Date {
    const date = new Date();
    date.setMinutes(date.getMinutes() + 1);

    return date;
  }

  async jwtVerify(jwt: string): Promise<any> {
    return await this.jwtService.verify(jwt);
  }

  jwtDecode(jwt: string): any {
    return this.jwtService.decode(jwt);
  }

  jwtSign(payload: any, expiresIn: string): string {
    return this.jwtService.sign(payload, { expiresIn });
  }

  public async findUserByEmailAddress(emailAddress: string): Promise<User> {
    return await this.userService.findOneUserByEmailAddress(emailAddress);
  }
}
