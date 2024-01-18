import { Mail } from '../configs.interface';
import { registerAs } from '@nestjs/config';

export const MailConfig = registerAs(
  'Mail',
  (): Mail => ({
    service: process.env.MAIL_SERVICE,
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT),
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
  }),
);
