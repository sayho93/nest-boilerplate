import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { GENERAL_CACHE } from '../../common/constants/cache.constant';
import { AlsModule } from '../als/als.module';
import { CacheModule } from '../cache/cache.module';
import { ConfigsModule } from '../configs/configs.module';
import { DatabaseModule } from '../database/database.module';
import { LoggerModule } from '../logger/logger.module';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigsModule,
        AlsModule,
        LoggerModule,
        CacheModule.registerAsync({ db: 0, providerToken: GENERAL_CACHE }),
        DatabaseModule,
      ],
      providers: [UsersService, UsersRepository],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
