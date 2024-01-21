import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AlsModule } from './als/als.module';
import { AppController } from './app.controller';
import { ConfigsModule } from './configs/configs.module';
import { DatabaseModule } from './database/database.module';
import { LoggerModule } from './logger/logger.module';
import { UsersModule } from './users/users.module';
import { GlobalExceptionsFilter } from '../filters/global-exceptions.filter';
import { RequestIdInterceptor } from '../interceptors/request-id.interceptor';
import { RequestLogInterceptor } from '../interceptors/request-log.interceptor';
import { AsyncLocalStorageMiddleware } from '../middlewares/async-local-storage.middleware';

@Module({
  imports: [ConfigsModule, AlsModule, LoggerModule, DatabaseModule, UsersModule],
  controllers: [AppController],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: RequestIdInterceptor },
    { provide: APP_INTERCEPTOR, useClass: RequestLogInterceptor },
    { provide: APP_FILTER, useClass: GlobalExceptionsFilter },
  ],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(AsyncLocalStorageMiddleware).forRoutes('*');
  }
}
