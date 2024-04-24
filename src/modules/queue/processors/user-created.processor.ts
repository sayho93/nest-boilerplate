import { Processor } from '@nestjs/bullmq';
import { BadRequestException } from '@nestjs/common';
import { Job } from 'bullmq';
import { CreditsService } from '../../credits/credits.service';
import { LoggerService } from '../../logger/logger.service';
import { MailService } from '../../mail/mail.service';
import { ProjectsService } from '../../projects/projects.service';
import { User } from '../../users/user.entity';
import { USER_CREATED_EVENT, UserCreatedEventOps } from '../queue.constant';
import { WorkerHostProcessor } from '../worker-host.process';

@Processor(USER_CREATED_EVENT)
export class UserCreatedProcessor extends WorkerHostProcessor {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly creditsService: CreditsService,
    private readonly mailService: MailService,
    protected readonly loggerService: LoggerService,
  ) {
    super();
  }

  public async process(job: Job<User, User | string, string>) {
    const user = job.data;

    switch (job.name) {
      case UserCreatedEventOps.CREATE_DEFAULT_PROJECT:
        return this.projectsService.create({});
      case UserCreatedEventOps.GRANT_CREDIT:
        return this.creditsService.create({});
      case UserCreatedEventOps.SEND_EMAIL:
        return this.mailService.sendSingle({
          to: 'fishcreek@naver.com',
          subject: 'Testing Mailer module',
          template: 'activation_code.html',
          context: {
            // Data to be sent to template engine.
            code: 'cf1a3f828287',
            username: 'john doe',
          },
        });
    }

    throw new BadRequestException(`Unknown job name: ${job.name}`);
  }
}
