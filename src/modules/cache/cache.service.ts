import { Cache } from '@nestjs/cache-manager';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CacheService {
  constructor(private cacheManager: Cache) {}

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
}
