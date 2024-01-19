import { Inject, Injectable, Scope } from '@nestjs/common';
import { INQUIRER } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { ClsService } from 'nestjs-cls';
import { v4 } from 'uuid';
import { Log } from './logger.interface';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService {
  private context: string;

  public constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly winstonLogger: WinstonLogger,
    @Inject(INQUIRER) private readonly caller: object,
    @Inject(ClsService)
    private readonly clsService: ClsService,
  ) {
    this.context = this.caller.constructor.name || 'Unknown';
  }

  private format(obj: object | string, message = '', requestId?: string): Log {
    if (!requestId) requestId = this.clsService.get('requestId');
    const log: Log = { message, requestId, logId: v4() };

    if (obj instanceof Error) {
      log.stack = obj.stack;
      return log;
    }

    if (typeof obj === 'string') {
      log.message = `${obj} ${message}`;
      return log;
    }

    log.data = obj;
    return log;
  }

  public setContext(context: string) {
    this.context = context;
  }

  public verbose(
    detailedContext: string,
    object: object | string,
    message?: string,
    requestId?: string,
  ) {
    const result = this.format(object, message, requestId);
    this.winstonLogger.verbose?.(result, `${this.context}/${detailedContext}`);
  }

  public debug(
    detailedContext: string,
    object: object | string,
    message?: string,
    requestId?: string,
  ) {
    const result = this.format(object, message, requestId);
    this.winstonLogger.debug?.(result, `${this.context}/${detailedContext}`);
  }

  public info(
    detailedContext: string,
    object: object | string,
    message?: string,
    requestId?: string,
  ) {
    const result = this.format(object, message, requestId);
    this.winstonLogger.log(result, `${this.context}/${detailedContext}`);
  }

  public warn(
    detailedContext: string,
    object: object | string,
    message?: string,
    requestId?: string,
  ) {
    const result = this.format(object, message, requestId);
    this.winstonLogger.warn(result, `${this.context}/${detailedContext}`);
  }

  public error(
    detailedContext: string,
    object: object | string,
    message?: string,
    requestId?: string,
  ) {
    const result = this.format(object, message, requestId);
    this.winstonLogger.error(
      result,
      undefined,
      `${this.context}/${detailedContext}`,
    );
  }
}
