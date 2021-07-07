import { SearchQueryDto } from './../../DTOs/search/searchQuery.dto';
import { SearchService } from './search.service';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { User } from 'src/models/user.model';
import { Post } from 'src/models/post.model';
import { FirebaseAuthGuard } from 'src/guards/firebase-auth.guard';

/**
 * Controller Implementation for search module.
 */
@Controller('search')
export class SearchController {
  // Injecting Search Service from NestJS Context.
  constructor(private readonly searchService: SearchService) {}

  /**
   * API Endpoint for searching user.
   * @param searchQueryDto DTO for search params
   * @returns User array of search results.
   */
  @UseGuards(FirebaseAuthGuard)
  @Get('user')
  public async searchForUsers(
    @Query() searchQueryDto: SearchQueryDto,
  ): Promise<User[]> {
    return await this.searchService.searchForUsers(searchQueryDto);
  }

  /**
   * API Endpoint for searching user.
   * @param searchQueryDto DTO for search params
   * @returns User array of search results.
   */
  @UseGuards(FirebaseAuthGuard)
  @Get('post')
  public async searchForPosts(
    @Query() searchQueryDto: SearchQueryDto,
  ): Promise<Post[]> {
    return await this.searchService.searchForPosts(searchQueryDto);
  }
}
