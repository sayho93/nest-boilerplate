import { Injectable, NestMiddleware } from '@nestjs/common';
import { AlsStorage } from '../modules/als/als.interface';
import { AlsService } from '../modules/als/als.service';

@Injectable()
export class AsyncLocalStorageMiddleware implements NestMiddleware {
  constructor(private readonly alsService: AlsService) {}
  public use(req: any, res: any, next: (error?: any) => void) {
    const storage: AlsStorage = {};
    return this.alsService.run(storage, () => next());
  }
}
