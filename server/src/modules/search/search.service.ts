import { SearchQueryDto } from './../../DTOs/search/searchQuery.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/models/user.model';
import { userIndex } from 'src/utils/algolia';
import { In, Repository } from 'typeorm';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async searchForUsers(searchQueryDto: SearchQueryDto): Promise<User[]> {
    try {
      const searchResults = await userIndex.search(searchQueryDto.searchQuery);
      const hits = searchResults.hits;

      const userIds = hits.map((hit) => hit.objectID);

      return await this.userRepository.find({
        where: {
          id: In(userIds),
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
}
