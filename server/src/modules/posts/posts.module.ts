import { Like } from 'src/models/like.model';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from 'src/models/image.model';
import { Post } from 'src/models/post.model';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { User } from 'src/models/user.model';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Image, Like, User])],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
