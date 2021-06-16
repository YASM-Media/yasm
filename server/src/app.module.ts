import { SearchModule } from './modules/search/search.module';
import { CommentsModule } from './modules/comments/comments.module';
import { LikeModule } from './modules/like/like.module';
import { FollowModule } from './modules/follow/follow.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { DummyModule } from './modules/dummy/dummy.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models/user.model';
import { Post } from './models/post.model';
import { Image } from './models/image.model';
import { PostsModule } from './modules/posts/posts.module';
import { Like } from './models/like.model';

@Module({
  imports: [
    TypeOrmModule.forRoot(
      process.env.NODE_ENV === 'development'
        ? {
            type: 'postgres',
            host: process.env.DATABASE_HOST,
            port: Number(process.env.DATABASE_PORT),
            username: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            synchronize: true,
            logging: true,
            entities: [User, Image, Post, Like],
          }
        : {
            type: 'postgres',
            url: process.env.DATABASE_URL,
            entities: [User, Image, Post, Like],
          },
    ),
    UserModule,
    AuthModule,
    FollowModule,
    PostsModule,
    LikeModule,
    CommentsModule,
    SearchModule,
    DummyModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
