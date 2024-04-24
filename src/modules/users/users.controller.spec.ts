import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { AlsModule } from '../als/als.module';
import { GENERAL_CACHE } from '../cache/cache.constant';
import { CacheModule } from '../cache/cache.module';
import { ConfigsModule } from '../configs/configs.module';
import { DatabaseModule } from '../database/database.module';
import { LoggerModule } from '../logger/logger.module';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigsModule,
        AlsModule,
        LoggerModule,
        CacheModule.registerAsync({ db: 0, providerToken: GENERAL_CACHE }),
        DatabaseModule,
      ],
      controllers: [UsersController],
      providers: [UsersService, UsersRepository],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
