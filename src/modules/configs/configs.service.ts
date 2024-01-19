import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configs } from './configs.interface';

@Injectable()
export class ConfigsService {
  constructor(private readonly configService: ConfigService<Configs>) {
    console.log(configService);
  }

  public get App() {
    return this.configService.get('App', { infer: true });
  }

  public get MariaDB() {
    return this.configService.get('MariaDB', { infer: true });
  }

  public get Redis() {
    return this.configService.get('Redis', { infer: true });
  }

  public get Mail() {
    return this.configService.get('Mail', { infer: true });
  }

  private get Firebase() {
    return this.configService.get('Firebase', { infer: true });
  }
}
