import { Union } from '../../common/types/union.type';

export const RequestType = {
  TypeA: 'TYPE_A',
  TypeB: 'TYPE_B',
  TypeC: 'TYPE_C',
} as const;

export type RequestType = Union<typeof RequestType>;
