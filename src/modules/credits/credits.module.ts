import { Module } from '@nestjs/common';
import { CreditsService } from './credits.service';
import { CreditsController } from './credits.controller';

@Module({
  controllers: [CreditsController],
  providers: [CreditsService],
})
export class CreditsModule {}
