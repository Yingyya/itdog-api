import { Test, TestingModule } from '@nestjs/testing';
import { ItdogService } from './itdog.service';

jest.setTimeout(1000 * 60);

describe('ItdogService', () => {
  let service: ItdogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItdogService],
    }).compile();

    service = module.get<ItdogService>(ItdogService);
  });

  it('ping test', async () => {
    const result = await service.ping('qq.com');
    console.log(JSON.stringify(result));
  });
});
