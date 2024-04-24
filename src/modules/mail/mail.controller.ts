import { Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('/')
  public async create() {
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
}
