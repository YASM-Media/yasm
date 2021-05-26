import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LikeDto } from 'src/DTOs/like/like.dto';
import { Like } from 'src/models/like.model';
import { User } from 'src/models/user.model';
import { Repository } from 'typeorm';
import { PostsService } from '../posts/posts.service';

/**
 * Service Implementation for Likes.
 */
@Injectable()
export class LikeService {
  // Injecting Like Repostory from Nest Context.
  // And also injecting Post Service.
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,

    private readonly postsService: PostsService,
  ) {}

  /**
   * Like a given post by id.
   * @param likeDto DTO For Likes
   * @param user Logged In User
   * @returns Like Model Object
   */
  public async likePost(likeDto: LikeDto, user: User): Promise<Like> {
    return await this.likeRepository.save({
      user: user,
      post: await this.postsService.getPostById(likeDto.postId),
    });
  }

  /**
   * Unlike a given post by id.
   * @param likeDto DTO For Likes
   * @param user Logged In User
   * @returns Unlike Confirmation
   */
  public async unlikePost(likeDto: LikeDto, user: User): Promise<string> {
    // Deleting the like data.
    await this.likeRepository.delete({
      user: user,
      post: await this.postsService.getPostById(likeDto.postId),
    });

    // Returning confirmation for deletion.
    return 'OK';
  }
}
