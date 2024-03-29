import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configs } from './configs.interface';
import { App } from './configurations/app.config';
import { Mail } from './configurations/mail.config';
import { MariaDB } from './configurations/mariaDB.config';
import { OAuth } from './configurations/oauth.config';
import { Redis } from './configurations/redis.config';

@Injectable()
export class ConfigsService {
  public constructor(private readonly configService: ConfigService<Configs>) {}

  public findAll() {
    return {
      [App.name]: this.App,
      [MariaDB.name]: this.MariaDB,
      [OAuth.name]: this.OAuth,
      [Redis.name]: this.Redis,
      [Mail.name]: this.Mail,
    };
  }

  public get App() {
    return this.configService.getOrThrow('App', { infer: true });
  }

  public get MariaDB() {
    return this.configService.getOrThrow('MariaDB', { infer: true });
  }

  public get OAuth() {
    return this.configService.getOrThrow('OAuth', { infer: true });
  }

  public get Redis() {
    return this.configService.getOrThrow('Redis', { infer: true });
  }

  public get Mail() {
    return this.configService.getOrThrow('Mail', { infer: true });
  }

  private get Firebase() {
    throw new Error('Not implemented');
    return this.configService.getOrThrow('Firebase', { infer: true });
  }
}
