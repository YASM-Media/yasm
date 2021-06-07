import { IsNotEmpty } from 'class-validator';

export class SearchQueryDto {
  @IsNotEmpty()
  searchQuery: string;
}
