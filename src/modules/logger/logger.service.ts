import { Inject, Injectable, Scope } from '@nestjs/common';
import { INQUIRER } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { v4 } from 'uuid';
import { Log } from './logger.interface';
import { AlsService } from '../als/als.service';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService {
  private context: string;

  public constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly winstonLogger: WinstonLogger,
    @Inject(INQUIRER) private readonly caller: object,
    private readonly alsService: AlsService,
  ) {
    this.context = this.caller.constructor.name || 'Unknown';
  }

  private format(obj: object | string, message = '', requestId?: string): Log {
    if (!requestId) requestId = this.alsService.requestId;
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

  private makeContextString(detailedContext: string) {
    return `${this.context}.${detailedContext}`;
  }

  public verbose(detailedContext: string, object: object | string, message?: string, requestId?: string) {
    const log = this.format(object, message, requestId);
    this.winstonLogger.verbose?.(log, this.makeContextString(detailedContext));
  }

  public debug(detailedContext: string, object: object | string, message?: string, requestId?: string) {
    const log = this.format(object, message, requestId);
    this.winstonLogger.debug?.(log, this.makeContextString(detailedContext));
  }

  public info(detailedContext: string, object: object | string, message?: string, requestId?: string) {
    const log = this.format(object, message, requestId);
    this.winstonLogger.log(log, this.makeContextString(detailedContext));
  }

  public warn(detailedContext: string, object: object | string, message?: string, requestId?: string) {
    const log = this.format(object, message, requestId);
    this.winstonLogger.warn(log, this.makeContextString(detailedContext));
  }

  public error(detailedContext: string, object: object | string, message?: string, requestId?: string) {
    const log = this.format(object, message, requestId);
    this.winstonLogger.error(log, undefined, this.makeContextString(detailedContext));
  }
}
