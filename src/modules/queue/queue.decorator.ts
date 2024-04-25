import { InjectQueue } from '@nestjs/bullmq';
import { CREDITS_QUEUE } from '../credits/credits.constant';
import { MAIL_QUEUE } from '../mail/mail.constant';
import { PROJECTS_QUEUE } from '../projects/projects.constant';

export const InjectMailQueue = () => InjectQueue(MAIL_QUEUE);
export const InjectCreditsQueue = () => InjectQueue(CREDITS_QUEUE);
export const InjectProjectsQueue = () => InjectQueue(PROJECTS_QUEUE);
