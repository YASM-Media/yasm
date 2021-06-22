import { Token } from './../../types/token.type';
import { RegisterUserDto } from './../../DTOs/registerUser.dto';
import { UserService } from './../user/user.service';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { User } from 'src/models/user.model';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from 'src/DTOs/loginUser.dto';
import { JwtService } from '@nestjs/jwt';
import admin from 'src/utils/firebase-admin';

/**
 * Service Implementation for Authentication Module.
 */
@Injectable()
export class AuthService {
  // Injecting the User and JWT Services.
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Record the details of the new user in the database.
   * @param registerUserDto User Registration DTO
   * @returns Registered User Object
   */
  public async registerUser(registerUserDto: RegisterUserDto): Promise<User> {
    const saltOrRounds = 10;

    // Hash the password before saving it to the database.
    registerUserDto.password = await bcrypt.hash(
      registerUserDto.password,
      saltOrRounds,
    );

    const registeredUser = await this.userService.registerNewUser(
      registerUserDto,
    );

    await admin.auth().createUser({
      uid: registeredUser.id,
      email: registerUserDto.emailAddress,
      password: registerUserDto.password,
      displayName: `${registerUserDto.firstName} ${registerUserDto.lastName}`,
    });

    return registeredUser;
  }

  /**
   * Validate the User details with the database and return a token
   * @param loginUserDto User Login DTO
   * @returns Logged In User Details with access token
   */
  public async loginUser(loginUserDto: LoginUserDto): Promise<Token> {
    // Validate the user details.
    const user = await this.validateUser(
      loginUserDto.emailAddress,
      loginUserDto.password,
    );

    // CASE 1: If there is a valid user object present.
    if (user) {
      // Return the validated user object with the access token
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
        user,
      };
    }

    // CASE 2: If there is no valid user, return an error for wrong details.
    else {
      throw new HttpException(
        'Either email address or password is incorrect',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  /**
   * Delete the user from database.
   * @param user User details
   * @param password User password
   * @returns Delete Confirmation
   */
  public async deleteUser(user: User, password: string): Promise<string> {
    // Validate the user details.
    const checkUser = await this.validateUser(user.emailAddress, password);

    // Delete the user if password is correct else throw an error.
    if (checkUser) {
      await this.userService.deleteUser(user);
    } else {
      throw new HttpException('Password is incorrect', HttpStatus.FORBIDDEN);
    }

    return 'OK';
  }

  /**
   * Checks the validity of the given email address and password.
   * @param emailAddress Email Address from the request.
   * @param password Password from the request.
   * @returns Validated User Object or null
   */
  public async validateUser(
    emailAddress: string,
    password: string,
  ): Promise<User | null> {
    // Check if a user exists with the given email address.
    const checkUser = await this.userService.findOneUserByEmailAddress(
      emailAddress,
    );

    // CASE 1: If there is a user existing with given email address.
    if (checkUser) {
      // Compare the hashed password and the given password.
      const checkPassword = await bcrypt.compare(password, checkUser.password);

      // CASE 1A: If the password matches the hashed password from database,
      // return the user object.
      if (checkPassword === true) {
        return checkUser;
      }

      // CASE 1B: If the password doesn't matches than that stored in the database,
      // Return an error with the error message as password does not matches.
      else {
        throw new HttpException(
          'Your password is incorrect',
          HttpStatus.FORBIDDEN,
        );
      }
    }

    // CASE 2: If the user does not exist with the given email address,
    // Return an error with the error message as the account does not exist.
    throw new HttpException(
      'Account does not exist with the given email address',
      HttpStatus.FORBIDDEN,
    );
  }

  /**
   * Returns date object of seven days later.
   * @returns Date seven days later
   */
  getSevenDaysLater(): Date {
    const date = new Date();
    date.setDate(date.getDate() + 7);

    return date;
  }

  /**
   * Returns date object of fifteen minutes later.
   * @returns Date fifteen minutes later
   */
  getFifteenMinutesLater(): Date {
    const date = new Date();
    date.setMinutes(date.getMinutes() + 1);

    return date;
  }

  // Wrapper method for JWT Service Verify
  async jwtVerify(jwt: string): Promise<any> {
    return await this.jwtService.verify(jwt);
  }

  // Wrapper method for JWT Service Decode
  jwtDecode(jwt: string): any {
    return this.jwtService.decode(jwt);
  }

  // Wrapper method for JWT Service Sign
  jwtSign(payload: any, expiresIn: string): string {
    return this.jwtService.sign(payload, { expiresIn });
  }

  // Wrapper method for User Service Find By Email Address
  public async findUserByEmailAddress(emailAddress: string): Promise<User> {
    return await this.userService.findOneUserByEmailAddress(emailAddress);
  }
}
