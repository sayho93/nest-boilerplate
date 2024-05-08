import { Test, TestingModule } from '@nestjs/testing';
import { AopService } from './aop.service';

describe('AopService', () => {
  let service: AopService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AopService],
    }).compile();

    service = module.get<AopService>(AopService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
