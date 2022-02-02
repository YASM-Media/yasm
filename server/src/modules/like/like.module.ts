import { ActivityModule } from './../activity/activity.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';
import { Like } from 'src/models/like.model';
import { PostsModule } from '../posts/posts.module';

@Module({
  imports: [TypeOrmModule.forFeature([Like]), PostsModule, ActivityModule],
  controllers: [LikeController],
  providers: [LikeService],
})
export class LikeModule {}
