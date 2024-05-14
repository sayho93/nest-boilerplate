import { CacheOptions } from '@nestjs/cache-manager';
import { CACHE_DECORATOR } from './cache.constant';
import { createDecorator } from '../aop/aop.util';

export const Cache = (options: CacheOptions) => createDecorator(CACHE_DECORATOR, options);
