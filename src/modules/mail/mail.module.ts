import path from 'path';
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerOptions } from '@nestjs-modules/mailer/dist/interfaces/mailer-options.interface';
import { MAIL_QUEUE } from './mail.constant';
import { MailQueueProcessor } from './mail.processor';
import { MailService } from './mail.service';
import { ConfigsService } from '../configs/configs.service';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [
    QueueModule.register({ queues: [MAIL_QUEUE] }),
    MailerModule.forRootAsync({
      inject: [ConfigsService],
      useFactory: (configsService: ConfigsService): MailerOptions => {
        const mailConfig = configsService.Mail;

        return {
          transport: {
            service: mailConfig.service,
            host: mailConfig.host,
            port: mailConfig.port,
            auth: {
              user: mailConfig.user,
              pass: mailConfig.password,
            },
            logger: false,
            debug: false,
          },
          defaults: { from: '"sayho" <sayho@psyho.kr>' },
          preview: false,
          template: {
            dir: path.resolve('templates'),
            adapter: new HandlebarsAdapter(),
            options: { strict: true },
          },
        };
      },
    }),
  ],
  providers: [MailService, MailQueueProcessor],
  exports: [MailService],
})
export class MailModule {}
