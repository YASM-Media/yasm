import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateStoryDto } from 'src/DTOs/story/create-story.dto';
import { Story } from 'src/models/story.model';
import { User } from 'src/models/user.model';
import { Repository } from 'typeorm';

@Injectable()
export class StoryService {
  constructor(
    @InjectRepository(Story)
    private readonly storyRepository: Repository<Story>,
  ) {}

  public async createStory(
    user: User,
    createStoryDto: CreateStoryDto,
  ): Promise<Story> {
    const newStory: Story = new Story();
    newStory.storyUrl = createStoryDto.storyUrl;
    newStory.user = user;

    return await this.storyRepository.save(newStory);
  }
}
