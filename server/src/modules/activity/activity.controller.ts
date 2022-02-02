import { ActivityService } from './activity.service';
import { FirebaseAuthGuard } from './../../guards/firebase-auth.guard';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { LoggedInUser } from 'src/decorators/logged-in-user.decorator';
import { Activity } from 'src/models/activity.model';
import { User } from 'src/models/user.model';

@Controller('activity')
@UseGuards(FirebaseAuthGuard)
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  public async fetchActivity(@LoggedInUser() user: User): Promise<Activity[]> {
    return await this.activityService.fetchActivity(user);
  }
}
