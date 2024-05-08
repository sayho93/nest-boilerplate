import { applyDecorators, Injectable, SetMetadata } from '@nestjs/common';
import { ASPECT } from './aop.constant';

export function Aspect(metadataKey: string | symbol) {
  return applyDecorators(SetMetadata(ASPECT, metadataKey), Injectable);
}
