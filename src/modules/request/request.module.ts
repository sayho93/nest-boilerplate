import { Module } from '@nestjs/common';
import { RequestRepository } from './repositories/request.repository';
import { RequestTypeARepository } from './repositories/requestTypeA.repository';
import { RequestTypeBRepository } from './repositories/requestTypeB.repository';
import { RequestTypeCRepository } from './repositories/requestTypeC.repository';
import { RequestController } from './request.controller';
import { RequestService } from './request.service';
import { TypeOrmExModule } from '../database/typeorm-ex.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      RequestRepository,
      RequestTypeARepository,
      RequestTypeBRepository,
      RequestTypeCRepository,
    ]),
    UsersModule,
  ],
  controllers: [RequestController],
  providers: [RequestService],
})
export class RequestModule {}
