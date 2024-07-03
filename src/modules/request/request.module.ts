import { Module } from '@nestjs/common';
import { RequestController } from './request.controller';
import { RequestService } from './request.service';
import { GenericTypeOrmRepository } from '../database/generic-typeorm.repository';
import { TypeOrmExModule } from '../database/typeorm-ex.module';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([GenericTypeOrmRepository])],
  controllers: [RequestController],
  providers: [RequestService],
})
export class RequestModule {}
