import { NotificationModule } from './../notification/notification.module';
import { Activity } from './../../models/activity.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service';

@Module({
  imports: [TypeOrmModule.forFeature([Activity]), NotificationModule],
  providers: [ActivityService],
  exports: [ActivityService],
})
export class ActivityModule {}
