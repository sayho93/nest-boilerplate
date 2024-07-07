import { Module } from '@nestjs/common';
import { RequestRepository } from './repositories/request.repository';
import { RequestTypeAARepository } from './repositories/requestTypeAA.repository';
import { RequestTypeABRepository } from './repositories/requestTypeAB.repository';
import { RequestTypeACRepository } from './repositories/requestTypeAC.repository';
import { RequestTypeBARepository } from './repositories/requestTypeBA.repository';
import { RequestTypeBBRepository } from './repositories/requestTypeBB.repository';
import { RequestTypeBCRepository } from './repositories/requestTypeBC.repository';
import { RequestTypeCARepository } from './repositories/requestTypeCA.repository';
import { RequestTypeCBRepository } from './repositories/requestTypeCB.repository';
import { RequestTypeCCRepository } from './repositories/requestTypeCC.repository';
import { RequestController } from './request.controller';
import { RequestService } from './request.service';
import { TypeOrmExModule } from '../database/typeorm-ex.module';
import { ProjectsModule } from '../projects/projects.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      RequestRepository,
      RequestTypeAARepository,
      RequestTypeABRepository,
      RequestTypeACRepository,
      RequestTypeBARepository,
      RequestTypeBBRepository,
      RequestTypeBCRepository,
      RequestTypeCARepository,
      RequestTypeCBRepository,
      RequestTypeCCRepository,
    ]),
    UsersModule,
    ProjectsModule,
  ],
  controllers: [RequestController],
  providers: [RequestService],
})
export class RequestModule {}
