import { applyDecorators, SetMetadata } from '@nestjs/common';
import { TRANSACTIONAL_KEY, TRANSACTIONAL_OPTION } from '../../modules/database/database.constant';
import { TransactionalOptions } from '../../modules/database/database.interface';

export function Transactional(options?: TransactionalOptions): MethodDecorator {
  const decorators: MethodDecorator[] = [SetMetadata(TRANSACTIONAL_KEY, true)];
  if (options) {
    decorators.push(SetMetadata(TRANSACTIONAL_OPTION, options));
  }
  return applyDecorators(...decorators);
}
