import { ClassSerializerInterceptor, MiddlewareConsumer, Module, NestModule, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AlsModule } from './als/als.module';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { GENERAL_CACHE } from './cache/cache.constant';
import { CacheModule } from './cache/cache.module';
import { ConfigsModule } from './configs/configs.module';
import { CreditsModule } from './credits/credits.module';
import { DatabaseModule } from './database/database.module';
import { EventsModule } from './events/events.module';
import { JwtModule } from './jwt/jwt.module';
import { LoggerModule } from './logger/logger.module';
import { MailModule } from './mail/mail.module';
import { ProjectsModule } from './projects/projects.module';
import { QueueModule } from './queue/queue.module';
import { UsersModule } from './users/users.module';
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
    QueueModule.forRoot([]),
    JwtModule,
    MailModule,
    UsersModule,
    AuthModule,
    ProjectsModule,
    CreditsModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_PIPE, useFactory: () => new ValidationPipe({ transform: true }) },
    { provide: APP_INTERCEPTOR, useClass: RequestIdInterceptor },
    { provide: APP_INTERCEPTOR, useClass: RequestLogInterceptor },
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_FILTER, useClass: GlobalExceptionsFilter },
  ],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(AsyncLocalStorageMiddleware).forRoutes('*');
  }
}
