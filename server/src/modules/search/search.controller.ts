import { SearchQueryDto } from './../../DTOs/search/searchQuery.dto';
import { JwtAuthGuard } from './../../guards/auth.guard';
import { SearchService } from './search.service';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { User } from 'src/models/user.model';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @UseGuards(JwtAuthGuard)
  @Get('user')
  public async searchForUsers(
    @Query() searchQueryDto: SearchQueryDto,
  ): Promise<User[]> {
    return await this.searchService.searchForUsers(searchQueryDto);
  }
}
