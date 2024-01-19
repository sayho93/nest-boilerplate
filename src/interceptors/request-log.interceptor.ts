import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';
import { Env } from '../modules/configs/configs.interface';
import { ConfigsService } from '../modules/configs/configs.service';
import { LoggerService } from '../modules/logger/logger.service';

interface RequestLog {
  method: string;
  url: string;
  userId?: string;
  headers?: object;
  query?: object;
  body?: string;
}

interface ResponseLog {
  status: number;
  responseTime: number;
  headers?: object;
}

@Injectable()
export class RequestLogInterceptor implements NestInterceptor {
  public constructor(
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigsService,
  ) {}

  public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isDevelopment = this.configService.App.env === Env.Development;

    let request: RequestLog;
    let response: ResponseLog;

    if (context.getType() === 'http') {
      const httpContext = context.switchToHttp();
      const req: Request = httpContext.getRequest();
      req['startTime'] = Date.now();

      // const userId = req.session?.credentials?.user?._id;
      const userId = undefined;

      let body;
      try {
        body = JSON.stringify(req.body);
      } catch {
        this.loggerService.warn(this.intercept.name, req.body, 'failed stringify request body');
      }

      // API Request Logging
      request = isDevelopment
        ? {
            method: req.method,
            url: req.url,
          }
        : {
            userId,
            method: req.method,
            url: req.url,
            headers: req.headers,
            query: req.query,
            body,
          };

      this.loggerService.info(this.intercept.name, { request }, `REQUEST [${request.method}]${request.url}`);
    }

    return next.handle().pipe(
      tap(() => {
        if (context.getType() === 'http') {
          const httpContext = context.switchToHttp();
          const req: Request = httpContext.getRequest();
          const res: Response = httpContext.getResponse();

          const responseTime = Date.now() - req['startTime'];

          // API Response Logging
          response = isDevelopment
            ? {
                status: res.statusCode,
                responseTime,
              }
            : {
                status: res.statusCode,
                responseTime,
                headers: res.getHeaders(),
              };

          this.loggerService.info(
            this.intercept.name,
            { request, response },
            `RESPONSE [${request.method}]${request.url}`,
          );
        }
      }),
    );
  }
}
