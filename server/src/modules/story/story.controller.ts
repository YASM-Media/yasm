import { DeleteStoryDto } from 'src/DTOs/story/delete-story.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LoggedInUser } from 'src/decorators/logged-in-user.decorator';
import { CreateStoryDto } from 'src/DTOs/story/create-story.dto';
import { FirebaseAuthGuard } from 'src/guards/firebase-auth.guard';
import { Story } from 'src/models/story.model';
import { User } from 'src/models/user.model';
import { StoryService } from './story.service';

@Controller('story')
@UseGuards(FirebaseAuthGuard)
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @Get('user')
  public async fetchStoriesForUser(
    @Query('userId') userId: string,
  ): Promise<Story[]> {
    return await this.storyService.fetchStoriesForUser(userId);
  }

  @Get()
  public async fetchStories(@LoggedInUser() user): Promise<User[]> {
    return await this.storyService.fetchStories(user);
  }

  @Get('archive')
  public async fetchArchivedStories(@LoggedInUser() user): Promise<Story[]> {
    return await this.storyService.fetchArchivedStories(user);
  }

  @Post()
  public async createStory(
    @LoggedInUser() user: User,
    @Body() createStoryDto: CreateStoryDto,
  ): Promise<Story> {
    return await this.storyService.createStory(user, createStoryDto);
  }

  @Delete()
  public async deleteStory(
    @LoggedInUser() user: User,
    @Body() deleteStoryDto: DeleteStoryDto,
  ): Promise<Story> {
    return await this.storyService.deleteStory(user, deleteStoryDto);
  }
}
