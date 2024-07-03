import { DataSource, EntityManager } from 'typeorm';
import { TRANSACTION_DECORATOR } from './transaction.constant';
import { Propagation, TransactionalOptions } from './transaction.interface';
import { TransactionalException } from '../../common/exceptions/transactional.exception';
import { AlsService } from '../als/als.service';
import { Aspect } from '../aop/aop.decorator';
import { LazyDecorator, WrapParams } from '../aop/aop.interface';

@Aspect(TRANSACTION_DECORATOR)
export class TransactionService implements LazyDecorator<any, TransactionalOptions> {
  constructor(
    private readonly alsService: AlsService,
    private readonly dataSource: DataSource,
  ) {}

  private async runInNewHookContext(cb: () => Promise<unknown>) {
    try {
      const result = await cb();
      // setImmediate(() => {
      //   eventEmitter.emit('transaction.commit');
      //   eventEmitter.emit('transaction.release', undefined);
      // });

      return result;
    } catch (err) {
      // eventEmitter.emit('transaction.rollback');
      // eventEmitter.emit('transaction.release', undefined);
      throw err;
    }
  }

  public wrap(params: WrapParams<any, TransactionalOptions | undefined>) {
    const { alsService, dataSource, runInNewHookContext } = this;

    return async function (...args: any[]) {
      const storedEntityManager = alsService.entityManager;
      const propagation = params?.metadata?.propagation ?? Propagation.REQUIRED;
      const isolationLevel = params?.metadata?.isolationLevel;

      const runOriginal = async () => await params.method(...args);

      const transactionCallback = async (entityManager: EntityManager) => {
        alsService.entityManager = entityManager;
        try {
          return await runOriginal();
        } finally {
          alsService.entityManager = undefined;
        }
      };

      const runWithNewTransaction = async () => {
        return await runInNewHookContext(async () => {
          if (!alsService.entityManager) {
            if (isolationLevel) return dataSource.transaction(isolationLevel, transactionCallback);
            return dataSource.transaction(transactionCallback);
          }

          if (isolationLevel) return alsService.entityManager.transaction(isolationLevel, transactionCallback);
          return alsService.entityManager.transaction(transactionCallback);
        });
      };

      const runWithoutTransaction = async () => {
        return await runInNewHookContext(async () => {
          const currentTransaction = alsService.entityManager;
          alsService.entityManager = undefined;
          const originalMethodResult = await runOriginal();
          alsService.entityManager = currentTransaction;

          return originalMethodResult;
        });
      };

      switch (propagation) {
        case Propagation.MANDATORY:
          if (!storedEntityManager) {
            throw new TransactionalException('No existing transaction found');
          }

          return await runOriginal();

        case Propagation.NESTED:
          return await runWithNewTransaction();

        case Propagation.NEVER:
          if (storedEntityManager) {
            throw new TransactionalException('Found existing transaction');
          }
          return await runWithoutTransaction();

        case Propagation.NOT_SUPPORTED:
          if (storedEntityManager) {
            return await runWithoutTransaction();
          }

          return await runOriginal();

        case Propagation.REQUIRED:
          if (storedEntityManager) return await runOriginal();
          return await runWithNewTransaction();

        case Propagation.REQUIRES_NEW:
          return runWithNewTransaction();

        case Propagation.SUPPORTS:
        //TODO

        default:
          throw new Error('propagation option is unreachable');
      }
    };
  }
}
