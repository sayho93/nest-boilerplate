import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigsService } from './configs.service';
import { AppConfig } from './configurations/app.config';
import { MailConfig } from './configurations/mail.config';
import { MariaDBConfig } from './configurations/mariaDB.config';
import { OAuthConfig } from './configurations/oauth.config';
import { RedisConfig } from './configurations/redis.config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      envFilePath: [`.env/.env.${process.env.NODE_ENV}`, '.env/.env.development'],
      load: [AppConfig, MariaDBConfig, OAuthConfig, RedisConfig, MailConfig],
    }),
  ],
  providers: [ConfigsService],
  exports: [ConfigsService],
})
export class ConfigsModule {
  get configService() {
    return Reflect.getMetadata('providers', this);
  }
}
