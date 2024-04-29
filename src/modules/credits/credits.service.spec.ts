import { Test, TestingModule } from '@nestjs/testing';
import { ModuleMocker } from 'jest-mock';
import { CREDITS_QUEUE } from './credits.constant';
import { CreditsQueueProcessor } from './credits.processor';
import { CreditsRepository } from './credits.repository';
import { CreditsService } from './credits.service';
import { mockFactory } from '../../../test/common/mock.factory';
import { ConfigsModule } from '../configs/configs.module';
import { QueueModule } from '../queue/queue.module';
import { UsersService } from '../users/users.service';

describe('CreditsService', () => {
  let module: TestingModule;
  let service: CreditsService;
  let usersService: jest.Mocked<UsersService>;
  let repository: jest.Mocked<CreditsRepository>;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigsModule,
        QueueModule.forRoot([]),
        QueueModule.register({ queues: [CREDITS_QUEUE], flows: [CREDITS_QUEUE] }),
      ],
      providers: [CreditsService, CreditsQueueProcessor],
    })
      .useMocker(mockFactory(new ModuleMocker(global)))
      .compile();

    repository = module.get(CreditsRepository);
    usersService = module.get(UsersService);
    service = module.get(CreditsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
