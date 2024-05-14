import { applyDecorators } from '@nestjs/common';
import { AopMetadata } from './aop.interface';

export const AddMetadata = <K extends string | symbol = string, V = any>(
  metadataKey: K,
  metadataValue: V,
): MethodDecorator => {
  const decoratorFactory = (
    _: any,
    __: string | symbol,
    descriptor: PropertyDescriptor,
  ): TypedPropertyDescriptor<any> => {
    if (!Reflect.hasMetadata(metadataKey, descriptor.value)) {
      Reflect.defineMetadata(metadataKey, [metadataValue], descriptor.value);

      return descriptor;
    }

    Reflect.getMetadata(metadataKey, descriptor.value).push(metadataValue);

    return descriptor;
  };

  decoratorFactory.KEY = metadataKey;

  return decoratorFactory;
};

export const createDecorator = (metadataKey: symbol | string, metadata?: unknown): MethodDecorator => {
  const aopSymbol = Symbol('AOP_DECORATOR');

  return applyDecorators(
    // 1. Add metadata to the method
    (target: object, propertyKey: string | symbol, descriptor: PropertyDescriptor) =>
      AddMetadata<symbol | string, AopMetadata>(metadataKey, {
        originalFn: descriptor.value,
        metadata,
        aopSymbol,
      })(target, propertyKey, descriptor),
    // 2. Wrap the method before the lazy decorator is executed
    (_: object, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
      const originalFn = descriptor.value;

      descriptor.value = function (this: any, ...args: unknown[]) {
        const wrappedFn = this[aopSymbol]?.[propertyKey];
        if (wrappedFn) {
          // If there is a wrapper stored in the method, use it
          return wrappedFn.apply(this, args);
        }
        // if there is no wrapper that comes out of method, call originalFn
        return originalFn.apply(this, args);
      };

      /**
       * There are codes that using `function.name`.
       * Therefore the codes below are necessary.
       *
       * ex) @nestjs/swagger
       */
      Object.defineProperty(descriptor.value, 'name', {
        value: propertyKey.toString(),
        writable: false,
      });
      Object.setPrototypeOf(descriptor.value, originalFn);
    },
  );
};
