import { AuthService } from './../auth/auth.service';
import { Token } from './../../types/token.type';
import { EmailUpdateDto } from './../../DTOs/emailUpdate.dto';
import { JwtService } from '@nestjs/jwt';
import { ProfileDto } from './../../DTOs/profile.dto';
import { User } from 'src/models/user.model';
import { RegisterUserDto } from './../../DTOs/registerUser.dto';
import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as _ from 'lodash';
import admin from 'src/utils/firebase-admin';
import fetch from 'node-fetch';

/**
 * Implementation for the user service.
 */
@Injectable()
export class UserService {
  // Injecting the User Repository and the JWT Service
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Find a corresponding user for the given email address.
   * @param emailAddress Email Address of the given user.
   * @returns Corresponding User object
   */
  public async findOneUserByEmailAddress(emailAddress: string): Promise<User> {
    return this.userRepository.findOne({ emailAddress: emailAddress });
  }

  /**
   * Find a corresponding user for the given email address.
   * @param emailAddress Email Address of the given user.
   * @returns Corresponding User object with follow data.
   */
  public async findOneUserByEmailAddressWithRelations(
    emailAddress: string,
  ): Promise<User> {
    return (
      await this.userRepository.find({
        relations: ['followers', 'following'],
        where: { emailAddress },
      })
    )[0];
  }

  /**
   * Find a corresponding user for the given id.
   * @param id ID of the given user.
   * @returns Corresponding User object
   */
  public async findOneUserById(id: string): Promise<User> {
    return this.userRepository.findOne({ id: id });
  }

  /**
   * Find a corresponding user for the given id.
   * @param id ID of the given user.
   * @returns Corresponding User object with relations
   */
  public async findOneUserByIdWithRelations(id: string): Promise<User> {
    return (
      await this.userRepository.find({
        relations: ['followers', 'following'],
        where: { id },
      })
    )[0];
  }

  /**
   * Fetch Suggested Users
   * @param user Logged In Users.
   */
  public async fetchSuggestedUsers(user: User): Promise<User[]> {
    // Fetch the followers and following details for logged in users.
    const loggedInUserRelation = await this.findOneUserByIdWithRelations(
      user.id,
    );

    // Fetch details of following users.
    const followingUser = await this.userRepository.find({
      where: {
        id: In([
          ...loggedInUserRelation.following.map((u) => u.id),
          ...loggedInUserRelation.followers.map((u) => u.id),
        ]),
      },
      relations: [
        'followers',
        'following',
        'following.followers',
        'following.following',
        'followers.followers',
        'followers.following',
      ],
    });

    // Get top users.
    const results: User[] = await this.userRepository.find({
      where: {
        id: In(
          (
            await this.userRepository
              .createQueryBuilder('user1')
              .select('user1.id AS id')
              .addSelect('COUNT(user2.id) AS followers')
              .leftJoin('user1.followers', 'user2')
              .groupBy('user1.id')
              .orderBy('followers', 'DESC')
              .getRawMany()
          )
            .map((user) => user.id)
            .filter((id) => user.id !== id),
        ),
      },
      relations: ['followers', 'following'],
    });

    // Following of following users.
    const fof1 = _.flatten(followingUser.map((u) => u.following)).filter(
      (u) => u.id !== user.id,
    );
    const fof2 = _.flatten(followingUser.map((u) => u.followers)).filter(
      (u) => u.id !== user.id,
    );
    const fof = [...fof1, ...fof2, ...results];

    // Return a small sample of the fof.
    return _.sampleSize(_.uniqBy(fof, 'id'), fof.length >= 5 ? 5 : fof.length);
  }

  /**
   * Save a user to the database aka registration.
   * @param registerUserDto Register User DTO
   * @returns Registered User Object
   */
  public async registerNewUser(
    registerUserDto: RegisterUserDto,
  ): Promise<User> {
    // To check if the user already exists in the database.
    const checkUser = await this.findOneUserByEmailAddress(
      registerUserDto.emailAddress,
    );

    if (!checkUser) {
      // Create a new user and copy all the details into it.
      const user = new User();

      user.emailAddress = registerUserDto.emailAddress;
      user.firstName = registerUserDto.firstName;
      user.lastName = registerUserDto.lastName;

      // Save the user to the database.
      await this.userRepository.save(user);

      return await this.findOneUserByEmailAddress(user.emailAddress);
    }

    // Throw an exception if the user already exists
    else {
      throw new HttpException(
        'User already exists for the specified email address',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  /**
   * To update the logged in user's profile
   * @param loggedInUser Logged In User
   * @param profileDto User Profile Update DTO
   * @returns Updated User object
   */
  public async updateUserProfile(
    loggedInUser: User,
    profileDto: ProfileDto,
  ): Promise<User> {
    // Copy the new details to the object.
    loggedInUser.firstName = profileDto.firstName;
    loggedInUser.lastName = profileDto.lastName;
    loggedInUser.biography = profileDto.biography;
    loggedInUser.imageUrl = profileDto.imageUrl;

    await admin.auth().updateUser(loggedInUser.id, {
      displayName: `${profileDto.firstName} ${profileDto.lastName}`,
      photoURL: profileDto.imageUrl,
    });

    // Save it to the database.
    return await this.userRepository.save(loggedInUser);
  }

  /**
   * To update the email address of the logged in user.
   * @param user Logged In User
   * @param emailUpdateDto User Email Update DTO
   * @returns Updated user object with new token.
   */
  public async updateEmailAddress(
    user: User,
    emailUpdateDto: EmailUpdateDto,
  ): Promise<Token> {
    // To check if the password given is the correct password or not.
    const check = await this.validateFirebaseUser(
      user.emailAddress,
      emailUpdateDto.password,
    );

    if (check) {
      // Update the email address and save the updated object to the database.
      user.emailAddress = emailUpdateDto.emailAddress;
      const updatedUser = await this.userRepository.save(user);

      // Regenerate the access token for continue of usage for the user.
      const accessToken = this.jwtService.sign(
        {
          email: updatedUser.emailAddress,
          accessTimeLimit: this.getFifteenMinutesLater(),
          refreshTimeLimit: this.getSevenDaysLater(),
        },
        {
          expiresIn: '7d',
        },
      );

      // Returning the token and the user.
      return {
        accessToken: accessToken,
        user: updatedUser,
      };
    }
    // Throwing an HttpException if the password's don't match.
    else {
      throw new HttpException(
        'Your password is incorrect',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  /**
   * Delete corresponding user.
   * @param user User Model
   */
  public async deleteUser(user: User): Promise<void> {
    await this.userRepository.remove(user);
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
    return await this.findOneUserByEmailAddress(emailAddress);
  }
}
