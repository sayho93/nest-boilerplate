import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { ASPECT } from './aop.constant';
import { AopMetadata, LazyDecorator } from './aop.interface';

@Injectable()
export class AopService implements OnModuleInit {
  private readonly wrappedMethodCache = new WeakMap();

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly reflector: Reflector,
  ) {}

  private lookupLazyDecorators(providers: InstanceWrapper[]): LazyDecorator[] {
    const { reflector } = this;

    return providers
      .filter((wrapper) => wrapper.isDependencyTreeStatic())
      .filter(({ instance, metatype }) => {
        if (!instance || !metatype) return false;

        const aspect =
          reflector.get<string>(ASPECT, metatype) ||
          reflector.get<string>(ASPECT, Object.getPrototypeOf(instance).constructor);
        if (!aspect) return false;

        return typeof instance.wrap === 'function';
      })
      .map(({ instance }) => instance);
  }

  private wrapMethod({
    lazyDecorator,
    aopMetadata,
    methodName,
    target,
  }: {
    lazyDecorator: LazyDecorator;
    aopMetadata: AopMetadata;
    methodName: string;
    target: any;
  }) {
    const { originalFn, metadata, aopSymbol } = aopMetadata;

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    const wrappedFn = function (this: object, ...args: unknown[]) {
      const cache = self.wrappedMethodCache.get(this) || new WeakMap();
      const cached = cache.get(originalFn);
      if (cached) return cached.apply(this, args);

      const wrappedMethod = lazyDecorator.wrap({
        instance: this,
        methodName,
        method: originalFn.bind(this),
        metadata,
      });
      cache.set(originalFn, wrappedMethod);
      self.wrappedMethodCache.set(this, cache);
      return wrappedMethod.apply(this, args);
    };

    target[aopSymbol] ??= {};
    target[aopSymbol][methodName] = wrappedFn;
  }

  private applyLazyDecorator(lazyDecorator: LazyDecorator, instanceWrapper: InstanceWrapper<any>) {
    const target = instanceWrapper.isDependencyTreeStatic()
      ? instanceWrapper.instance
      : instanceWrapper.metatype.prototype;

    const propertyKeys = this.metadataScanner.getAllMethodNames(Object.getPrototypeOf(target));
    const metadataKey = this.reflector.get(ASPECT, lazyDecorator.constructor);

    // instance에 method names 를 순회하면서 lazyDecorator.wrap을 적용함
    for (const propertyKey of propertyKeys) {
      // the target method is must be object or function
      // @see: https://github.com/rbuckton/reflect-metadata/blob/9562d6395cc3901eaafaf8a6ed8bc327111853d5/Reflect.ts#L938
      const targetProperty = target[propertyKey];
      if (!targetProperty || (typeof targetProperty !== 'object' && typeof targetProperty !== 'function')) {
        continue;
      }

      const metadataList: AopMetadata[] = this.reflector.get<AopMetadata[]>(metadataKey, targetProperty);
      if (!metadataList) continue;

      for (const aopMetadata of metadataList) {
        this.wrapMethod({ lazyDecorator, aopMetadata, methodName: propertyKey, target });
      }
    }
  }

  private bootstrapLazyDecorators() {
    const controllers = this.discoveryService.getControllers();
    const providers = this.discoveryService.getProviders();

    const lazyDecorators = this.lookupLazyDecorators(providers);
    if (!lazyDecorators.length) return;

    const instanceWrappers = providers
      .concat(controllers)
      .filter(({ instance }) => instance && Object.getPrototypeOf(instance));

    for (const lazyDecorator of lazyDecorators) {
      for (const wrapper of instanceWrappers) {
        this.applyLazyDecorator(lazyDecorator, wrapper);
      }
    }
  }

  public onModuleInit() {
    this.bootstrapLazyDecorators();
  }
}
