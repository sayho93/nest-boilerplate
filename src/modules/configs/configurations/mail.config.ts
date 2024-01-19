import { registerAs } from '@nestjs/config';
import { IsNumber, IsString } from 'class-validator';
import { validateConfig } from './validation';
import { Mail as IMail } from '../configs.interface';

export class Mail implements IMail {
  @IsString()
  service: string;

  @IsString()
  host: string;

  @IsNumber()
  port: number;

  @IsString()
  user: string;

  @IsString()
  password: string;
}

export const MailConfig = registerAs(Mail.name, () => {
  const config = {
    service: process.env.MAIL_SERVICE,
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
  };

  return validateConfig(Mail, config);
});
