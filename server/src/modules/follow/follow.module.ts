import { ActivityModule } from './../activity/activity.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';
import { User } from 'src/models/user.model';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ActivityModule],
  controllers: [FollowController],
  providers: [FollowService],
})
export class FollowModule {}
