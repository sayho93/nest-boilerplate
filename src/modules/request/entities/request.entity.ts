import { ChildEntity, Column, Entity, TableInheritance } from 'typeorm';
import { BaseUuidActorEntity } from '../../database/base.entity';
import { RequestType } from '../request.interface';

@Entity('request')
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class Request extends BaseUuidActorEntity {
  @Column({ name: 'type', type: 'varchar', length: 64 })
  public type: RequestType;

  @Column({ name: 'additionalData1', type: 'varchar', length: 255 })
  public additionalData1: string;

  @Column({ name: 'additionalData2', type: 'varchar', length: 255 })
  public additionalData2: string;

  @Column({ name: 'additionalData3', type: 'varchar', length: 255 })
  public additionalData3: string;
}

@ChildEntity()
export class RequestTypeA extends Request {
  @Column({ name: 'type', type: 'varchar', length: 255 })
  specificPropertyA: string;
}

@ChildEntity()
export class RequestTypeB extends Request {
  @Column({ name: 'type', type: 'varchar', length: 255 })
  specificPropertyB: string;
}

@ChildEntity()
export class RequestTypeC extends Request {
  @Column({ name: 'type', type: 'varchar', length: 255 })
  specificPropertyC: string;
}
