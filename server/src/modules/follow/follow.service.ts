import { UserService } from 'src/modules/user/user.service';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/models/user.model';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
  ) {}

  public async followUser(loggedInUser: User, followId: string): Promise<User> {
    const rootUserWithRelations =
      await this.userService.findOneUserByEmailAddressWithRelations(
        loggedInUser.emailAddress,
      );

    const followUser = await this.userService.findOneUserById(followId);

    if (!followUser) {
      throw new HttpException(
        'The user you are trying to follow does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    const followUserWithRelations =
      await this.userService.findOneUserByIdWithRelations(followId);

    const check = rootUserWithRelations.following.find(
      (user) => user.id === followUser.id,
    );

    if (!check) {
      rootUserWithRelations.following.push(followUser);
      followUserWithRelations.followers.push(loggedInUser);

      await this.userRepository.save(followUserWithRelations);
      return await this.userRepository.save(rootUserWithRelations);
    } else {
      throw new HttpException(
        'You are already following the user',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  public async unfollowUser(
    loggedInUser: User,
    followId: string,
  ): Promise<User> {
    const rootUserWithRelations =
      await this.userService.findOneUserByEmailAddressWithRelations(
        loggedInUser.emailAddress,
      );

    const followUser = await this.userService.findOneUserById(followId);

    if (!followUser) {
      throw new HttpException(
        'The user you are trying to unfollow does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    const followUserWithRelations =
      await this.userService.findOneUserByIdWithRelations(followId);

    const check = rootUserWithRelations.following.find(
      (user) => user.id === followUser.id,
    );

    if (check) {
      rootUserWithRelations.following = rootUserWithRelations.following.filter(
        (user) => user.id !== followId,
      );

      followUserWithRelations.followers =
        followUserWithRelations.followers.filter(
          (user) => user.id !== loggedInUser.id,
        );

      await this.userRepository.save(followUserWithRelations);
      return await this.userRepository.save(rootUserWithRelations);
    } else {
      throw new HttpException(
        'You are not following the user',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  public async getFollowersAndFollowing(loggedInUser: User): Promise<User> {
    return await this.userService.findOneUserByEmailAddressWithRelations(
      loggedInUser.emailAddress,
    );
  }

  public async getFollowersAndFollowingForUser(id: string): Promise<User> {
    return await this.userService.findOneUserByIdWithRelations(id);
  }
}
