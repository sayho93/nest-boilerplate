import { ChildEntity, Column, Entity, TableInheritance } from 'typeorm';
import { BaseUuidActorEntity } from '../../database/base.entity';
import { RequestType } from '../request.interface';

@Entity('request')
@TableInheritance({ column: { type: 'enum', name: 'type', enum: RequestType } })
export class Request extends BaseUuidActorEntity {
  @Column({ name: 'additionalData1', type: 'varchar', length: 255 })
  public additionalData1: string;

  @Column({ name: 'additionalData2', type: 'varchar', length: 255 })
  public additionalData2: string;

  @Column({ name: 'additionalData3', type: 'varchar', length: 255 })
  public additionalData3: string;
}

@ChildEntity()
export class RequestTypeA extends Request {
  type: typeof RequestType.TypeA;

  @Column({ name: 'specificPropertyA', type: 'varchar', length: 255 })
  specificPropertyA: string;
}

@ChildEntity()
export class RequestTypeB extends Request {
  type: typeof RequestType.TypeB;

  @Column({ name: 'specificPropertyB', type: 'varchar', length: 255 })
  specificPropertyB: string;
}

@ChildEntity()
export class RequestTypeC extends Request {
  type: typeof RequestType.TypeC;

  @Column({ name: 'specificPropertyC', type: 'varchar', length: 255 })
  specificPropertyC: string;
}
