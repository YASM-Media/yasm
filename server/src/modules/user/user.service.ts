import { Token } from './../../types/token.type';
import { EmailUpdateDto } from './../../DTOs/emailUpdate.dto';
import { JwtService } from '@nestjs/jwt';
import { ProfileDto } from './../../DTOs/profile.dto';
import { User } from 'src/models/user.model';
import { RegisterUserDto } from './../../DTOs/registerUser.dto';
import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { PasswordUpdateDto } from 'src/DTOs/passwordUpdate.dto';
import * as _ from 'lodash';

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
        id: In(loggedInUserRelation.following.map((u) => u.id)),
      },
      relations: [
        'followers',
        'following',
        'following.followers',
        'following.following',
      ],
    });

    // Following of following users.
    const fof = _.flatten(followingUser.map((u) => u.following)).filter(
      (u) => u.id !== user.id,
    );

    // Return a small sample of the fof.
    return _.sampleSize(fof, fof.length >= 5 ? 5 : fof.length);
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
      user.password = registerUserDto.password;

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
    const checkPassword = await bcrypt.compare(
      emailUpdateDto.password,
      user.password,
    );

    if (checkPassword === true) {
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
   * To update the logged in user's password.
   * @param user Logged In User Details.
   * @param passwordUpdateDto User Password Update DTO.
   * @returns Updated User Object.
   */
  public async updatePassword(
    user: User,
    passwordUpdateDto: PasswordUpdateDto,
  ): Promise<User> {
    // To check if the old passwords match.
    const checkPassword = await bcrypt.compare(
      passwordUpdateDto.oldPassword,
      user.password,
    );

    if (checkPassword === true) {
      // Hashing the new password.
      const saltOrRounds = 10;
      const passwordHash = await bcrypt.hash(
        passwordUpdateDto.newPassword,
        saltOrRounds,
      );

      // Updating the user object and saving it in the database.
      user.password = passwordHash;
      return await this.userRepository.save(user);
    }

    // Throw an exception if the password's don't match.
    else {
      throw new HttpException(
        'Your password is incorrect',
        HttpStatus.FORBIDDEN,
      );
    }
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
}
