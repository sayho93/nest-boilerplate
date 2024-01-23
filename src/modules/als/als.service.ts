import { AsyncLocalStorage } from 'async_hooks';
import { Injectable } from '@nestjs/common';
import { AlsStorage } from './als.interface';

@Injectable()
export class AlsService {
  public constructor(private readonly asyncLocalStorage: AsyncLocalStorage<AlsStorage>) {}

  public get store() {
    return this.asyncLocalStorage.getStore();
  }

  public run<T>(store: AlsStorage, callback: () => T) {
    return this.asyncLocalStorage.run(store, callback);
  }

  public get requestId(): AlsStorage['requestId'] {
    return this.store?.requestId;
  }

  public set requestId(requestId: string) {
    if (this.store) this.store.requestId = requestId;
  }

  public get entityManager(): AlsStorage['entityManager'] {
    return this.store?.entityManager;
  }

  public set entityManager(entityManager: AlsStorage['entityManager']) {
    if (this.store) this.store.entityManager = entityManager;
  }
}
