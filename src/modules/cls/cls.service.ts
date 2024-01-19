import { Injectable } from '@nestjs/common';
import { ClsService as ClsServicePkg } from 'nestjs-cls';
import { ClsStorage } from './cls.interface';

@Injectable()
export class ClsService {
  public constructor(private readonly clsService: ClsServicePkg<ClsStorage>) {}

  public runWith(store: ClsStorage, callback: () => void) {
    return this.clsService.runWith(store, callback);
  }

  public get(key: keyof ClsStorage) {
    const store = this.clsService.get();
    return store?.[key];
  }

  public set(key: keyof ClsStorage, value: any) {
    const store = this.clsService.get();
    if (store) {
      store[key] = value;
    }
  }
}
