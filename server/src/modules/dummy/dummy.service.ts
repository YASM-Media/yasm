import { Injectable } from '@nestjs/common';

@Injectable()
export class DummyService {
  async getDummyData(): Promise<{ dummy: string }> {
    return { dummy: 'dummy data' };
  }
}
