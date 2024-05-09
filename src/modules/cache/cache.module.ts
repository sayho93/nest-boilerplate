import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { DynamicModule, Global, Module } from '@nestjs/common';
import { redisStore } from 'cache-manager-ioredis-yet';
import { CacheDecoratorService } from './cache-decorator.service';
import { CacheService } from './cache.service';
import { Env } from '../configs/configs.interface';
import { ConfigsModule } from '../configs/configs.module';
import { ConfigsService } from '../configs/configs.service';

interface CacheModuleOptions {
  db: number;
  providerToken: symbol;
}

@Global()
@Module({})
export class CacheModule {
  static registerAsync(options: CacheModuleOptions): DynamicModule {
    return {
      module: CacheModule,
      imports: [
        NestCacheModule.registerAsync({
          imports: [ConfigsModule],
          inject: [ConfigsService],
          useFactory: (configsService: ConfigsService) => {
            const appConfig = configsService.App;
            const redisConfig = configsService.Redis;

            const connectOptions = {
              host: redisConfig.host,
              port: redisConfig.port,
              ...(appConfig.env === Env.Production && { password: redisConfig.password }),
              db: options.db,
            };

            return {
              store: redisStore,
              ...connectOptions,
            };
          },
        }),
      ],
      providers: [{ provide: options.providerToken, useClass: CacheService }, CacheDecoratorService],
      exports: [options.providerToken],
    };
  }
}
