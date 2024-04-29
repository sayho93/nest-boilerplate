import { Controller, Get } from '@nestjs/common';
import { BypassAuth } from './auth/decorators/auth.decorator';

@Controller('/')
export class AppController {
  public constructor() {}

  @BypassAuth()
  @Get('/ping')
  public ping() {
    return 'pong';
  }
}
