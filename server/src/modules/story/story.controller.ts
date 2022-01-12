import { Body, Controller, Post, UseGuards } from '@nestjs/common';
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

  @Post()
  public async createStory(
    @LoggedInUser() user: User,
    @Body() createStoryDto: CreateStoryDto,
  ): Promise<Story> {
    return await this.storyService.createStory(user, createStoryDto);
  }
}
