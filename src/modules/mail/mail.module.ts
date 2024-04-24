import path from 'path';
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerOptions } from '@nestjs-modules/mailer/dist/interfaces/mailer-options.interface';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { ConfigsService } from '../configs/configs.service';
import { LoggerService } from '../logger/logger.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigsService],
      useFactory: (configsService: ConfigsService, loggerService: LoggerService): MailerOptions => {
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
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
