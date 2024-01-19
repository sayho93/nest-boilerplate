import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { v4 } from 'uuid';
import { ClsService } from '../modules/cls/cls.service';
import { LoggerService } from '../modules/logger/logger.service';

@Injectable()
export class RequestIdInterceptor implements NestInterceptor {
  public constructor(
    private readonly clsService: ClsService,
    private readonly loggerService: LoggerService,
  ) {}

  public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    try {
      if (context.getType() === 'http') {
        const request = context.switchToHttp().getRequest();
        const requestId = request.headers['x-request-id'] || v4();
        this.clsService.set('requestId', requestId);
        request.requestId = requestId;
        return next.handle();
      }
    } catch (err) {
      this.loggerService.error(`${RequestIdInterceptor.name}.${this.intercept.name}`, err);
      return next.handle();
    }

    return next.handle();
  }
}
