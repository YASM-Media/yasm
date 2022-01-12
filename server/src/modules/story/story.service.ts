import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateStoryDto } from 'src/DTOs/story/create-story.dto';
import { DeleteStoryDto } from 'src/DTOs/story/delete-story.dto';
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

  public async deleteStory(
    user: User,
    deleteStoryDto: DeleteStoryDto,
  ): Promise<Story> {
    const checkStory = await this.storyRepository.findOne({
      where: {
        user: user,
        id: deleteStoryDto.storyId,
      },
    });

    if (checkStory) {
      return await this.storyRepository.remove(checkStory);
    } else {
      throw new NotFoundException('Story Not Found');
    }
  }
}
