export type KeyEqualsValueRecord<T extends string> = {
  [K in T]: K;
};
