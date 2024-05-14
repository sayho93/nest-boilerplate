import { Cache, CacheOptions } from '@nestjs/cache-manager';
import { CACHE_DECORATOR } from './cache.constant';
import { Aspect } from '../aop/aop.decorator';
import { LazyDecorator, WrapParams } from '../aop/aop.interface';
import { LoggerService } from '../logger/logger.service';

@Aspect(CACHE_DECORATOR)
export class CacheDecoratorService implements LazyDecorator<any, CacheOptions> {
  constructor(
    private readonly cache: Cache,
    private readonly loggerService: LoggerService,
  ) {}

  public wrap(params: WrapParams<any, CacheOptions>) {
    const key = `${params.instance.constructor.name}.${params.methodName}`;

    return async (...args: any[]) => {
      const cachedValue = await this.cache.get(key);
      if (cachedValue) {
        this.loggerService.verbose(this.wrap.name, { args, key }, 'cache hit');
        return cachedValue;
      }

      const methodResult = await params.method(...args);
      await this.cache.set(key, methodResult);

      this.loggerService.verbose(this.wrap.name, { args, key }, 'cache miss');

      return methodResult;
    };
  }
}
