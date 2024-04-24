import { Cache } from '@nestjs/cache-manager';
import { Injectable } from '@nestjs/common';
import { EmailVerificationCache } from './cache.interface';
import { ConfigsService } from '../configs/configs.service';

@Injectable()
export class CacheService {
  constructor(
    private cacheManager: Cache,
    private readonly configsService: ConfigsService,
  ) {}

  public async test(): Promise<any> {
    return this.cacheManager.store;
  }

  public async get(key: string) {
    return this.cacheManager.get(key);
  }

  public async set(key: string, value: any, ttl?: number) {
    await this.cacheManager.set(key, value, ttl || 0);
  }

  public async del(key: string) {
    await this.cacheManager.del(key);
  }

  public async clear() {
    await this.cacheManager.reset();
  }

  public async setEmailVerification(key: string, value: EmailVerificationCache, ttl?: number) {
    await this.set(key, value, ttl);
  }

  public async getEmailVerification(key: string): Promise<EmailVerificationCache | undefined> {
    return this.cacheManager.get(key);
  }
}
