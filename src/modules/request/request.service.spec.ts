import { Test, TestingModule } from '@nestjs/testing';
import { RequestService } from './request.service';
import { AppModule } from '../app.module';
import { LoggerService } from '../logger/logger.service';

describe('RequestService', () => {
  let service: RequestService;
  let loggerService: LoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<RequestService>(RequestService);
    loggerService = await module.resolve<LoggerService>(LoggerService);
  });

  // it('creates', async () => {
  //   await Promise.all(
  //     Array.from({ length: 4 }, async () => {
  //       const typeA = await service.createTypeA();
  //       const typeB = await service.createTypeB();
  //       const typeC = await service.createTypeC();
  //       loggerService.debug('test', { typeA, typeB, typeC }, '');
  //     }),
  //   );
  // });

  it('finds', async () => {
    const result = await service.findAll();
  });
});
