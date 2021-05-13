import { AuthModule } from './../auth/auth.module';
import { Module } from '@nestjs/common';
import { DummyController } from './dummy.controller';
import { DummyService } from './dummy.service';

@Module({
  imports: [AuthModule],
  controllers: [DummyController],
  providers: [DummyService],
})
export class DummyModule {}
