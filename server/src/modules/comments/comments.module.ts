import { PostsModule } from './../posts/posts.module';
import { Post } from 'src/models/post.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { Image } from 'src/models/image.model';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Image]), PostsModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
