import { InjectQueue } from '@nestjs/bullmq';
import { USER_CREATED_EVENT } from './queue.constant';

export const InjectUserCreatedQueue = () => InjectQueue(USER_CREATED_EVENT);
