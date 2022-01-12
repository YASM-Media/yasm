import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { StoryController } from './story.controller';
import { StoryService } from './story.service';
import { Story } from 'src/models/story.model';

@Module({
  imports: [TypeOrmModule.forFeature([Story])],
  controllers: [StoryController],
  providers: [StoryService],
})
export class StoryModule {}
