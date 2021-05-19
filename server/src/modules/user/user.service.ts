import { ProfileDto } from './../../DTOs/profile.dto';
import { User } from 'src/models/user.model';
import { RegisterUserDto } from './../../DTOs/registerUser.dto';
import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async findOneUserByEmailAddress(emailAddress: string): Promise<User> {
    return this.userRepository.findOne({ emailAddress: emailAddress });
  }

  public async registerNewUser(
    registerUserDto: RegisterUserDto,
  ): Promise<User> {
    const checkUser = await this.findOneUserByEmailAddress(
      registerUserDto.emailAddress,
    );

    if (!checkUser) {
      const user = new User();

      user.emailAddress = registerUserDto.emailAddress;
      user.firstName = registerUserDto.firstName;
      user.lastName = registerUserDto.lastName;
      user.password = registerUserDto.password;

      await this.userRepository.save(user);

      return await this.findOneUserByEmailAddress(user.emailAddress);
    } else {
      throw new HttpException(
        'User already exists for the specified email address',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  public async updateUserProfile(
    loggedInUser: User,
    profileDto: ProfileDto,
  ): Promise<User> {
    loggedInUser.firstName = profileDto.firstName;
    loggedInUser.lastName = profileDto.lastName;
    loggedInUser.biography = profileDto.biography;
    loggedInUser.imageUrl = profileDto.imageUrl;

    return await this.userRepository.save(loggedInUser);
  }
}
