import { Controller, Get, Version } from '@nestjs/common';

@Controller('/')
export class AppController {
  public constructor() {}

  @Version('1')
  @Get('/ping')
  public ping() {
    return 'pong';
  }
}
