import { SearchQueryDto } from './../../DTOs/search/searchQuery.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/models/user.model';
import { userIndex } from 'src/utils/algolia';
import { In, Repository } from 'typeorm';

/**
 * Service Implementation for Search Module.
 */
@Injectable()
export class SearchService {
  // Injecting User Repository from NestJS Context.
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
}
