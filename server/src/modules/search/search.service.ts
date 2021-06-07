import { SearchQueryDto } from './../../DTOs/search/searchQuery.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/models/user.model';
import { postIndex, userIndex } from 'src/utils/algolia';
import { In, Repository } from 'typeorm';
import { Post } from 'src/models/post.model';

/**
 * Service Implementation for Search Module.
 */
@Injectable()
export class SearchService {
  // Injecting User and Post Repository from NestJS Context.
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  /**
   * Search for users given a query param in algolia and fetch data from Postgres.
   * @param searchQueryDto DTO for search params
   * @returns User array for search results.
   */
  public async searchForUsers(searchQueryDto: SearchQueryDto): Promise<User[]> {
    try {
      // Search for users in algolia database for the given search param.
      const searchResults = await userIndex.search(searchQueryDto.searchQuery);
      const hits = searchResults.hits;

      // Get the user ids from the search results.
      const userIds = hits.map((hit) => hit.objectID);

      // Return users fetched from the database.
      return await this.userRepository.find({
        where: {
          id: In(userIds),
        },
      });
    } catch (error) {
      // Log the error when it happens.
      console.log(error);
    }
  }

  /**
   * Search for posts given a query param in algolia and fetch data from Postgres.
   * @param searchQueryDto DTO for search params
   * @returns Posts array for search results.
   */
  public async searchForPosts(searchQueryDto: SearchQueryDto): Promise<Post[]> {
    try {
      // Search for posts in algolia database for the given search param.
      const searchResults = await postIndex.search(searchQueryDto.searchQuery);
      const hits = searchResults.hits;

      // Get the post ids from the search results.
      const postIds = hits.map((hit) => hit.objectID);

      // Return post fetched from the database.
      return await this.postRepository.find({
        relations: [
          'user',
          'images',
          'likes',
          'likes.user',
          'comments',
          'comments.likes',
          'comments.user',
          'comments.likes.user',
        ],
        where: {
          id: In(postIds),
        },
      });
    } catch (error) {
      // Log the error when it happens.
      console.log(error);
    }
  }
}
