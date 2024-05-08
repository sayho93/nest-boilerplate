import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { AopService } from './aop.service';

@Module({
  imports: [DiscoveryModule],
  providers: [AopService],
})
export class AopModule {}
