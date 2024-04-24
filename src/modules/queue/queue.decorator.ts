import { InjectQueue } from '@nestjs/bullmq';
import { USER_CREATED_EVENT } from './queue.constant';
import { MAIL_QUEUE } from '../mail/mail.constant';

export const InjectUserCreatedQueue = () => InjectQueue(USER_CREATED_EVENT);
export const InjectMailQueue = () => InjectQueue(MAIL_QUEUE);
