import { registerAs } from '@nestjs/config';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { validateConfig } from './validation';

export class Mail {
  @IsString()
  service: string;

  @IsString()
  host: string;

  @Type(() => Number)
  @IsNumber()
  port: number;

  @IsString()
  user: string;

  @IsString()
  password: string;

  constructor() {}
}

export const MailConfig = registerAs(Mail.name, (): InstanceType<typeof Mail> => {
  const config = {
    service: process.env.MAIL_SERVICE,
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
  };

  return validateConfig(Mail, config);
});
