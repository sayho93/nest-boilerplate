import { ArgumentsHost, Catch, HttpException, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import { LoggerService } from 'src/modules/logger/logger.service';
import { Env } from '../modules/configs/configs.interface';
import { ConfigsService } from '../modules/configs/configs.service';

@Catch()
export class GlobalExceptionsFilter extends BaseExceptionFilter {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly configsService: ConfigsService,
  ) {
    super();
  }

  catch(exception: any, host: ArgumentsHost) {
    const isLocal = this.configsService.App.env === Env.Development;

    if (host.getType() === 'http') {
      const context = host.switchToHttp();
      const req: Request = context.getRequest();
      const res: Response = context.getResponse();

      const { requestId } = req;
      const errorResponse = {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: exception?.message || 'An unexpected error occurred.',
      };

      if (exception instanceof HttpException) {
        errorResponse.status = exception.getStatus();

        if (this.configsService.App.env !== Env.Production) {
          const tmp = exception.getResponse() as any;
          errorResponse.message = tmp.message || exception.message;
        }
      }

      const responseTime = Date.now() - req['startTime'];
      let body = JSON.stringify({});
      try {
        body = JSON.stringify(req.body);
      } catch {
        this.loggerService.warn(this.catch.name, req.body, 'failed stringify request body');
      }

      // API Request Logging
      const request = isLocal
        ? { method: req.method, url: req.url }
        : { method: req.method, url: req.url, headers: req.headers, query: req.query, body: body };

      // API Response Logging
      const response = isLocal
        ? { status: errorResponse.status, responseTime }
        : { status: errorResponse.status, responseTime, headers: res.getHeaders() };

      if (errorResponse.status >= 500) {
        this.loggerService.error(this.catch.name, exception, 'An unexpected error occurred.', requestId);
      }

      this.loggerService.warn(
        this.catch.name,
        { request, response, errorResponse, exception: exception?.stack },
        `-->[ERROR RESPONSE]: ${request.method}, [URL]: ${request.url}, [STATUS]: ${errorResponse.status}, [TIME]: ${responseTime}ms`,
        requestId,
      );

      this.loggerService.warn(
        this.catch.name,
        { request, response, errorResponse, exception: exception?.stack },
        `[ERROR] [${request.method}]${request.url}`,
      );

      res.status(errorResponse.status).json(errorResponse);
    }
  }
}
