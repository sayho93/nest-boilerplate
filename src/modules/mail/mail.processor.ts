import { Processor } from '@nestjs/bullmq';
import { BadRequestException } from '@nestjs/common';
import { ISendMailOptions } from '@nestjs-modules/mailer';
import { Job } from 'bullmq';
import { MAIL_QUEUE, MailQueueOps } from './mail.constant';
import { MailService } from './mail.service';
import { LoggerService } from '../logger/logger.service';
import { WorkerHostProcessor } from '../queue/worker-host.process';

@Processor(MAIL_QUEUE)
export class MailQueueProcessor extends WorkerHostProcessor {
  public constructor(
    private readonly mailService: MailService,
    protected readonly loggerService: LoggerService,
  ) {
    super();
  }

  public async process(job: Job<ISendMailOptions, void>) {
    switch (job.name) {
      case MailQueueOps.SEND_SINGLE:
        return this.mailService.sendSingle(job.data);
      case MailQueueOps.SEND_BULK:
        throw new BadRequestException('not implemented');
    }

    throw new BadRequestException(`Unknown job name: ${job.name}`);
  }
}
