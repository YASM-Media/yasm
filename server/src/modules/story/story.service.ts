import { UserService } from 'src/modules/user/user.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateStoryDto } from 'src/DTOs/story/create-story.dto';
import { DeleteStoryDto } from 'src/DTOs/story/delete-story.dto';
import { Story } from 'src/models/story.model';
import { User } from 'src/models/user.model';
import { getRepository, Repository, MoreThanOrEqual } from 'typeorm';

@Injectable()
export class StoryService {
  constructor(
    @InjectRepository(Story)
    private readonly storyRepository: Repository<Story>,

    private readonly userService: UserService,
  ) {}

  public async fetchStoriesForUser(userId: string): Promise<Story[]> {
    const dbUser = await this.userService.findOneUserById(userId);

    if (!dbUser) {
      throw new NotFoundException('User Not Found');
    }

    // Getting 24 hours earlier date.
    const date = new Date();
    date.setDate(date.getDate() - 1);

    return await this.storyRepository.find({
      where: {
        user: dbUser,
        createdAt: MoreThanOrEqual(date),
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  public async fetchStories(user: User): Promise<User[]> {
    const dbUser =
      await this.userService.findOneUserByEmailAddressWithRelations(
        user.emailAddress,
      );

    if (dbUser.following.length === 0) {
      return [];
    }

    // Getting 24 hours earlier date.
    const date = new Date();
    date.setDate(date.getDate() - 1);

    const dbStories = await getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.stories', 'story')
      .where('user.id IN (:...ids)', {
        ids: dbUser.following.map((usr) => usr.id),
      })
      .andWhere('story.createdAt > :date', { date: date })
      .orderBy('story.createdAt', 'DESC')
      .getMany();

    return dbStories;
  }

  public async fetchArchivedStories(user: User): Promise<Story[]> {
    return await this.storyRepository.find({
      where: {
        user: user,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

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
