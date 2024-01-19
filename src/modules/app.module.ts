import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ClsInterceptor } from 'nestjs-cls';
import { ClsModule } from './cls/cls.module';
import { ConfigsModule } from './configs/configs.module';
import { LoggerModule } from './logger/logger.module';
import { UsersModule } from './users/users.module';
import { RequestIdInterceptor } from '../interceptors/request-id.interceptor';
import { RequestLogInterceptor } from '../interceptors/request-log.interceptor';

@Module({
  imports: [ConfigsModule, ClsModule, LoggerModule, UsersModule],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ClsInterceptor },
    { provide: APP_INTERCEPTOR, useClass: RequestIdInterceptor },
    { provide: APP_INTERCEPTOR, useClass: RequestLogInterceptor },
  ],
})
export class AppModule {}
