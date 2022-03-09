import { ActivityService } from './../activity/activity.service';
import { UserService } from 'src/modules/user/user.service';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/models/user.model';

/**
 * Follow Service Implementation
 */
@Injectable()
export class FollowService {
  // Injecting in the user repository and the user service.
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
    private readonly activityService: ActivityService,
  ) {}

  /**
   * Follow a given user, invoked by the controller.
   * @param loggedInUser Logged In User Details
   * @param followId ID to follow
   * @returns User object with follow details
   */
  public async followUser(loggedInUser: User, followId: string): Promise<User> {
    // Get the follow details of the logged in user.
    const rootUserWithRelations =
      await this.userService.findOneUserByIdWithRelations(loggedInUser.id);

    // Get the details of the user to be followed.
    const followUser = await this.userService.findOneUserById(followId);

    // If the user to be followed does not exist, throw a HttpException for not found.
    if (!followUser) {
      throw new HttpException(
        'The user you are trying to follow does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    // Get the follow details of the user to be followed.
    const followUserWithRelations =
      await this.userService.findOneUserByIdWithRelations(followId);

    // To check if the logged in user already follows the given user.
    const check = rootUserWithRelations.following.find(
      (user) => user.id === followUser.id,
    );

    if (!check) {
      // Update the corresponding with new follower and following.
      rootUserWithRelations.following.push(followUser);
      followUserWithRelations.followers.push(loggedInUser);

      await this.userRepository.save(followUserWithRelations);
      const follow = await this.userRepository.save(rootUserWithRelations);

      await this.activityService.createActivityForFollow(
        followUserWithRelations,
        rootUserWithRelations,
      );

      return follow;
    }

    // If the logged in user already follows the give user, throw an error.
    else {
      throw new HttpException(
        'You are already following the user',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  /**
   * Unfollow a given user, invoked by the controller.
   * @param loggedInUser Logged In User details
   * @param followId ID of the user to unfollow
   * @returns User object with follow details
   */
  public async unfollowUser(
    loggedInUser: User,
    followId: string,
  ): Promise<User> {
    // Get the follow details of the logged in user.
    const rootUserWithRelations =
      await this.userService.findOneUserByIdWithRelations(loggedInUser.id);

    // Get the details of the user to be followed.
    const followUser = await this.userService.findOneUserById(followId);

    // If the user to be followed does not exist, throw a HttpException for not found.
    if (!followUser) {
      throw new HttpException(
        'The user you are trying to unfollow does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    // Get the follow details of the user to be followed.
    const followUserWithRelations =
      await this.userService.findOneUserByIdWithRelations(followId);

    // To check if the logged in user does not follow the given user.
    const check = rootUserWithRelations.following.find(
      (user) => user.id === followUser.id,
    );

    if (check) {
      // Update the corresponding with new follower and following.
      rootUserWithRelations.following = rootUserWithRelations.following.filter(
        (user) => user.id !== followId,
      );

      followUserWithRelations.followers =
        followUserWithRelations.followers.filter(
          (user) => user.id !== loggedInUser.id,
        );

      await this.userRepository.save(followUserWithRelations);
      return await this.userRepository.save(rootUserWithRelations);
    }

    // If the logged in user does not follow the give user, throw an error.
    else {
      throw new HttpException(
        'You are not following the user',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  /**
   *  Returns follow details for the logged in user details.
   * @param loggedInUser Logged In User Details
   * @returns User object with follow details
   */
  public async getFollowersAndFollowing(loggedInUser: User): Promise<User> {
    return await this.userService.findOneUserByIdWithRelations(loggedInUser.id);
  }

  /**
   *  Returns follow details for the given user details.
   * @param id ID of the given
   * @returns User object with follow details
   */
  public async getFollowersAndFollowingForUser(id: string): Promise<User> {
    return await this.userService.findOneUserByIdWithRelations(id);
  }
}
