export class TypeormUpdatedPatchException extends Error {
  public name = 'TypeOrmUpdatedPatchException';

  constructor() {
    super(
      'It seems that TypeORM was updated. Patching "DataSource" is not safe. If you want to try to use the library, set the "patch" flag in the function "addTransactionalDataSource" to "false".',
    );
  }
}
