import { applyDecorators, SetMetadata } from '@nestjs/common';
import { TRANSACTIONAL_KEY } from '../constants/database.constant';

export function Transactional(): MethodDecorator {
  return applyDecorators(SetMetadata(TRANSACTIONAL_KEY, true));
}
