export type AnyFunction = (...args: unknown[]) => unknown;

export type AopMetadata = {
  originalFn: AnyFunction;
  metadata?: unknown;
  aopSymbol: symbol;
};

export type WrapParams<T extends AnyFunction = AnyFunction, M = unknown> = {
  instance: any;
  methodName: string;
  method: T;
  metadata: M;
};

export interface LazyDecorator<T extends AnyFunction = AnyFunction, M = unknown> {
  wrap(params: WrapParams<T, M>): T;
}
