import { AsyncLocalStorage } from 'async_hooks';
import { Injectable } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { AlsStorage } from './als.interface';

@Injectable()
export class AlsService {
  public constructor(private readonly asyncLocalStorage: AsyncLocalStorage<AlsStorage>) {}

  public run<T>(store: AlsStorage, callback: () => T) {
    return this.asyncLocalStorage.run(store, callback);
  }

  private get store() {
    return this.asyncLocalStorage.getStore();
  }

  public get requestId(): AlsStorage['requestId'] {
    return this.store?.requestId;
  }

  public set requestId(requestId: string) {
    if (this.store) this.store.requestId = requestId;
  }

  public get queryRunner(): AlsStorage['queryRunner'] {
    return this.store?.queryRunner;
  }

  public set queryRunner(queryRunner: QueryRunner) {
    if (this.store) this.store.queryRunner = queryRunner;
  }
}
