import { Injectable } from '@nestjs/common';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { SentMessageInfo } from 'nodemailer';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class MailService {
  public constructor(
    private readonly mailerService: MailerService,
    private readonly loggerService: LoggerService,
  ) {}

  public async sendSingle(options: ISendMailOptions): Promise<SentMessageInfo> {
    return await this.mailerService
      .sendMail(options)
      .then((e) => this.loggerService.verbose(this.sendSingle.name, e))
      .catch((err) => this.loggerService.error(this.sendSingle.name, err));
  }
}
