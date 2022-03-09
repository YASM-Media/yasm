import { RegisterGoogleUserDto } from './../../DTOs/auth/registerGoogleUser.dto';
import { EmailUpdateDto } from '../../DTOs/user/emailUpdate.dto';
import { ProfileDto } from '../../DTOs/user/profile.dto';
import { User } from 'src/models/user.model';
import { RegisterUserDto } from '../../DTOs/auth/registerUser.dto';
import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as _ from 'lodash';
import fetch from 'node-fetch';
import { FirebaseService } from '../firebase/firebase.service';

/**
 * Implementation for the user service.
 */
@Injectable()
export class UserService {
  // Injecting the User Repository and the JWT Service
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly firebaseService: FirebaseService,
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

  public async findUserWithEmailAddressById(id: string): Promise<User> {
    return await this.userRepository.findOne({
      where: {
        id: id,
      },
      select: ['emailAddress'],
    });
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
   * Save a google user to the database aka registration.
   * @param registerUserDto Register User DTO
   * @returns Registered User Object
   */
  public async registerGoogleUser(
    registerGoogleUserDto: RegisterGoogleUserDto,
  ): Promise<User> {
    // To check if the user already exists in the database.
    const checkUser = await this.findOneUserByEmailAddress(
      registerGoogleUserDto.emailAddress,
    );

    if (!checkUser) {
      // Create a new user and copy all the details into it.
      const user = new User();

      user.emailAddress = registerGoogleUserDto.emailAddress;
      user.firstName = registerGoogleUserDto.firstName;
      user.lastName = registerGoogleUserDto.lastName;

      // Save the user to the database.
      await this.userRepository.save(user);

      return await this.findOneUserByEmailAddress(user.emailAddress);
    }

    // If user already exists, just return the database version of user.
    return checkUser;
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

    await this.firebaseService.firebaseAuth.updateUser(loggedInUser.id, {
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
  ): Promise<void> {
    console.log('lobjbb');

    console.log(emailUpdateDto);

    // To check if the password given is the correct password or not.
    const check = await this.validateFirebaseUser(
      user.id,
      emailUpdateDto.password,
    );

    console.log('lol');

    if (check) {
      // Update the email address and save the updated object to the database.

      console.log('lol2');

      user.emailAddress = emailUpdateDto.emailAddress;
      await this.userRepository.save(user);
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
   * Check user credentials with firebase.
   * @param emailAddress Email Address given by the user.
   * @param password Password given by the user.
   * @returns Corresponding user object.
   */
  public async validateFirebaseUser(
    id: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      select: ['emailAddress'],
    });

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
          email: user.emailAddress,
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
        console.log(responseJson);

        throw new HttpException(
          'Either the email address or the password is wrong. Please try again.',
          HttpStatus.FORBIDDEN,
        );
      }
    }

    // Return the user object corresponding to the credentials
    return await this.findOneUserByEmailAddress(user.emailAddress);
  }
}
