import { Cache, CacheOptions } from '@nestjs/cache-manager';
import { CACHE_DECORATOR } from './cache.constant';
import { Aspect } from '../aop/aop.decorator';
import { LazyDecorator, WrapParams } from '../aop/aop.interface';

@Aspect(CACHE_DECORATOR)
export class CacheDecoratorService implements LazyDecorator<any, CacheOptions> {
  constructor(private readonly cache: Cache) {}

  wrap(params: WrapParams<any, CacheOptions>) {
    const key = `${params.instance.constructor.name}.${params.methodName}`;

    return async (...args: any[]) => {
      console.log(args);

      const cachedValue = await this.cache.get(key);
      if (cachedValue) return cachedValue;

      const methodResult = await params.method(...args);
      await this.cache.set(key, methodResult);

      return methodResult;
    };
  }
}
