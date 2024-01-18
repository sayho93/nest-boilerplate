import { Global, Module } from '@nestjs/common';
import { ConfigsService } from './configs.service';
import { ConfigModule } from '@nestjs/config';
import { validate } from './configurations/validation';
import { AppConfig } from './configurations/App.config';
import { MariaDBConfig } from './configurations/mariaDB.config';
import { RedisConfig } from './configurations/redis.config';
import { MailConfig } from './configurations/mail.config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`, 'dotenv/local.env'],
      load: [AppConfig, MariaDBConfig, RedisConfig, MailConfig],
      validate,
    }),
  ],
  providers: [ConfigsService],
  exports: [ConfigsService],
})
export class ConfigsModule {}
