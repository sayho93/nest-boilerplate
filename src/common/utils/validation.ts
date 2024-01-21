export function isValueDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}
