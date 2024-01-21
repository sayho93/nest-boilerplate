import { AsyncLocalStorage } from 'async_hooks';
import { Global, Module } from '@nestjs/common';

import { AlsService } from './als.service';

@Global()
@Module({
  providers: [AlsService, { provide: AsyncLocalStorage, useValue: new AsyncLocalStorage() }],
  exports: [AlsService],
})
export class AlsModule {}
