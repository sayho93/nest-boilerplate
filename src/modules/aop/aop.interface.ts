export type AnyFunction = (...args: unknown[]) => unknown;

export type AopMetadata = {
  originalFn: AnyFunction;
  metadata?: unknown;
  aopSymbol: symbol;
};

export type WrapParams<T extends Function = Function, M = unknown> = {
  instance: any;
  methodName: string;
  method: T;
  metadata: M;
};

/**
 * Aspect 선언시 구현이 필요합니다.
 */
export interface LazyDecorator<T extends Function = Function, M = unknown> {
  wrap(params: WrapParams<T, M>): T;
}
