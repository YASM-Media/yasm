import { RegisterUserDto } from './../../DTOs/registerUser.dto';
import { UserService } from './../user/user.service';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { User } from 'src/models/user.model';
import { JwtService } from '@nestjs/jwt';
import admin from 'src/utils/firebase-admin';
import fetch from 'node-fetch';

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
    const userPassword = registerUserDto.password;

    const registeredUser = await this.userService.registerNewUser(
      registerUserDto,
    );

    await admin.auth().createUser({
      uid: registeredUser.id,
      email: registerUserDto.emailAddress,
      password: userPassword,
      displayName: `${registerUserDto.firstName} ${registerUserDto.lastName}`,
    });

    return registeredUser;
  }

  /**
   * Record the details of the new google user in the database.
   * @param registerUserDto User Registration DTO
   * @returns Registered User Object
   */
  public async registerGoogleUser(
    registerUserDto: RegisterUserDto,
  ): Promise<User> {
    const registeredUser = await this.userService.registerNewUser(
      registerUserDto,
    );

    return registeredUser;
  }

  /**
   * Delete the user from database.
   * @param user User details
   * @param password User password
   * @returns Delete Confirmation
   */
  public async deleteUser(user: User, password: string): Promise<string> {
    // Validate the user details.
    const checkUser = await this.validateFirebaseUser(
      user.emailAddress,
      password,
    );

    // Delete the user if password is correct else throw an error.
    if (checkUser) {
      await this.userService.deleteUser(user);
      await admin.auth().deleteUser(checkUser.id);
    } else {
      throw new HttpException('Password is incorrect', HttpStatus.FORBIDDEN);
    }

    return 'OK';
  }

  /**
   * Check user credentials with firebase.
   * @param emailAddress Email Address given by the user.
   * @param password Password given by the user.
   * @returns Corresponding user object.
   */
  public async validateFirebaseUser(
    emailAddress: string,
    password: string,
  ): Promise<User | null> {
    // Read the firebase web key from environment.
    const firebaseWebApiKey = process.env.FIREBASE_WEB_API_KEY;

    // Try to log in with the given credentials to check credentials.
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseWebApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailAddress,
          password: password,
          returnSecureToken: true,
        }),
      },
    );

    // Get the response code and json.
    const responseCode = response.status;
    const responseJson = await response.json();

    // Handle error with firebase codes.
    if (responseCode !== 200) {
      if (responseJson['error']['message'] === 'INVALID_PASSWORD') {
        throw new HttpException('Your password is wrong', HttpStatus.FORBIDDEN);
      } else if (responseJson['error']['message'] === 'EMAIL_NOT_FOUND') {
        throw new HttpException(
          'Account does not exist with the given email address',
          HttpStatus.FORBIDDEN,
        );
      } else if (
        responseJson['error']['message'] === 'TOO_MANY_ATTEMPTS_TRY_LATER'
      ) {
        throw new HttpException(
          'Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.',
          HttpStatus.FORBIDDEN,
        );
      } else if (responseJson['error']['message'] === 'USER_DISABLED') {
        throw new HttpException(
          'The user account has been disabled by an administrator.',
          HttpStatus.FORBIDDEN,
        );
      } else {
        throw new HttpException(
          'Either the email address or the password is wrong. Please try again.',
          HttpStatus.FORBIDDEN,
        );
      }
    }

    // Return the user object corresponding to the credentials
    return await this.userService.findOneUserByEmailAddress(emailAddress);
  }

  // Wrapper method for User Service Find By Email Address
  public async findUserByEmailAddress(emailAddress: string): Promise<User> {
    return await this.userService.findOneUserByEmailAddress(emailAddress);
  }
}
