import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { DummyModule } from './modules/dummy/dummy.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models/user.model';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      synchronize: true,
      logging: true,
      entities: [User],
    }),
    UserModule,
    AuthModule,
    DummyModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
