import { FirebaseModule } from './modules/firebase/firebase.module';
import { StoryModule } from './modules/story/story.module';
import { Story } from './models/story.model';
import { SearchModule } from './modules/search/search.module';
import { CommentsModule } from './modules/comments/comments.module';
import { LikeModule } from './modules/like/like.module';
import { FollowModule } from './modules/follow/follow.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models/user.model';
import { Post } from './models/post.model';
import { Image } from './models/image.model';
import { PostsModule } from './modules/posts/posts.module';
import { Like } from './models/like.model';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports:
    process.env.NODE_ENV === 'production'
      ? [
          TypeOrmModule.forRoot({
            type: 'postgres',
            url: process.env.DATABASE_URL,
            entities: [User, Image, Post, Like, Story],
            synchronize: true,
            logging: true,
            ssl: {
              rejectUnauthorized: false,
            },
          }),
          FirebaseModule,
          UserModule,
          AuthModule,
          FollowModule,
          PostsModule,
          LikeModule,
          CommentsModule,
          SearchModule,
          StoryModule,
          ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'react'),
          }),
        ]
      : [
          TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DATABASE_HOST,
            port: Number(process.env.DATABASE_PORT),
            username: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            synchronize: true,
            logging: true,
            entities: [User, Image, Post, Like, Story],
          }),
          FirebaseModule,
          UserModule,
          AuthModule,
          FollowModule,
          PostsModule,
          LikeModule,
          CommentsModule,
          SearchModule,
          StoryModule,
        ],
  controllers: [],
  providers: [],
})
export class AppModule {}
