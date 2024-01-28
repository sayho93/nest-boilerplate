import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

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
