import { ActivityType } from './../../enum/activity-type.enum';
import { NotificationService } from './../notification/notification.service';
import { Activity } from './../../models/activity.model';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from 'src/models/post.model';
import { User } from 'src/models/user.model';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,

    private readonly notificationService: NotificationService,
  ) {}

  public async createActivityForLike(
    post: Post,
    triggeredByUser: User,
  ): Promise<Activity> {
    const newActivity = new Activity();
    newActivity.activityType = ActivityType.Like;
    newActivity.mainUser = post.user;
    newActivity.triggeredByUser = triggeredByUser;
    newActivity.post = post;

    const savedActivity = await this.activityRepository.save(newActivity);

    await this.notificationService.sendActivityNotification(savedActivity);

    return savedActivity;
  }
}
