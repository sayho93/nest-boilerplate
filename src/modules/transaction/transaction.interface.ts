import { Union } from '../../common/types/union.type';

//! unsupported yet
export type DataSourceName = string | 'default';

export const Propagation = {
  /**
   * Support a current transaction, throw an exception if none exists.
   */
  MANDATORY: 'MANDATORY',
  /**
   * Execute within a nested transaction if a current transaction exists, behave like `REQUIRED` else.
   */
  NESTED: 'NESTED',
  /**
   * Execute non-transactionally, throw an exception if a transaction exists.
   */
  NEVER: 'NEVER',
  /**
   * Execute non-transactionally, suspend the current transaction if one exists.
   */
  NOT_SUPPORTED: 'NOT_SUPPORTED',
  /**
   * Support a current transaction, create a new one if none exists.
   */
  REQUIRED: 'REQUIRED',
  /**
   * Create a new transaction, and suspend the current transaction if one exists.
   */
  REQUIRES_NEW: 'REQUIRES_NEW',
  /**
   * Support a current transaction, execute non-transactionally if none exists.
   */
  SUPPORTS: 'SUPPORTS',
} as const;
export type Propagation = Union<typeof Propagation>;

export const IsolationLevel = {
  /**
   * A constant indicating that dirty reads, non-repeatable reads and phantom reads can occur.
   */
  READ_UNCOMMITTED: 'READ UNCOMMITTED',
  /**
   * A constant indicating that dirty reads are prevented; non-repeatable reads and phantom reads can occur.
   */
  READ_COMMITTED: 'READ COMMITTED',
  /**
   * A constant indicating that dirty reads and non-repeatable reads are prevented; phantom reads can occur.
   */
  REPEATABLE_READ: 'REPEATABLE READ',
  /**
   * A constant indicating that dirty reads, non-repeatable reads and phantom reads are prevented.
   */
  SERIALIZABLE: 'SERIALIZABLE',
} as const;
export type IsolationLevel = Union<typeof IsolationLevel>;

export interface TransactionalOptions {
  dataSourceName?: DataSourceName;
  propagation?: Propagation;
  isolationLevel?: IsolationLevel;
  name?: string | symbol;
}
