import { ClassSerializerInterceptor, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AlsModule } from './als/als.module';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { CacheModule } from './cache/cache.module';
import { ConfigsModule } from './configs/configs.module';
import { DatabaseModule } from './database/database.module';
import { EventsModule } from './events/events.module';
import { LoggerModule } from './logger/logger.module';
import { ProjectsModule } from './projects/projects.module';
import { UsersModule } from './users/users.module';
import { GENERAL_CACHE } from '../common/constants/cache.constant';
import { GlobalExceptionsFilter } from '../filters/global-exceptions.filter';
import { RequestIdInterceptor } from '../interceptors/request-id.interceptor';
import { RequestLogInterceptor } from '../interceptors/request-log.interceptor';
import { AsyncLocalStorageMiddleware } from '../middlewares/async-local-storage.middleware';

@Module({
  imports: [
    ConfigsModule,
    AlsModule,
    LoggerModule,
    DatabaseModule,
    EventsModule,
    CacheModule.registerAsync({ db: 0, providerToken: GENERAL_CACHE }),
    UsersModule,
    AuthModule,
    ProjectsModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: RequestIdInterceptor },
    { provide: APP_INTERCEPTOR, useClass: RequestLogInterceptor },
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
    { provide: APP_FILTER, useClass: GlobalExceptionsFilter },
  ],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(AsyncLocalStorageMiddleware).forRoutes('*');
  }
}
