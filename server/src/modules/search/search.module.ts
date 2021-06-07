import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { User } from 'src/models/user.model';
import { Post } from 'src/models/post.model';

@Module({
  imports: [TypeOrmModule.forFeature([User, Post])],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
