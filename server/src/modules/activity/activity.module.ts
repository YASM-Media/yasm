import { NotificationModule } from './../notification/notification.module';
import { Activity } from './../../models/activity.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Activity]), NotificationModule],
  providers: [ActivityService],
  exports: [ActivityService],
  controllers: [ActivityController],
})
export class ActivityModule {}
