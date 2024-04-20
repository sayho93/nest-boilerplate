import { InjectQueue } from '@nestjs/bullmq';
import { USER_CREATED } from '../users/users.const';

export const InjectUserCreatedQueue = () => InjectQueue(USER_CREATED.toString());
