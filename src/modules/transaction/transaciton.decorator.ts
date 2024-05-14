import { TRANSACTION_DECORATOR } from './transaction.constant';
import { TransactionalOptions } from './transaction.interface';
import { createDecorator } from '../aop/aop.util';

export const Transactional = (options?: TransactionalOptions) => createDecorator(TRANSACTION_DECORATOR, options);
