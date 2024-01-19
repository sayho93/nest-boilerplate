import { Global, Module } from '@nestjs/common';
import { ClsModule as ClsModuleInNest } from 'nestjs-cls';

import { ClsService } from './cls.service';

@Global()
@Module({
  imports: [ClsModuleInNest.forRoot({})],
  providers: [ClsService],
  exports: [ClsModuleInNest, ClsService],
})
export class ClsModule {}
