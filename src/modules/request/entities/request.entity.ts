import { ChildEntity, Column, Entity, ManyToOne, TableInheritance } from 'typeorm';
import { BaseUuidActorEntity } from '../../database/base.entity';
import { User } from '../../users/entities/user.entity';
import { RequestType } from '../request.interface';

@Entity('request')
@TableInheritance({ column: { type: 'enum', name: 'type', enum: RequestType } })
export class Request extends BaseUuidActorEntity {
  public type: RequestType;

  @Column({ name: 'additionalData1', type: 'varchar', length: 255 })
  public additionalData1: string;

  @Column({ name: 'additionalData2', type: 'varchar', length: 255 })
  public additionalData2: string;

  @Column({ name: 'additionalData3', type: 'varchar', length: 255 })
  public additionalData3: string;
}

@ChildEntity(RequestType.TypeA)
export class RequestTypeA extends Request {
  public override type: typeof RequestType.TypeA;

  @Column({ name: 'specificPropertyA', type: 'varchar', length: 255 })
  public specificPropertyA: string;

  @ManyToOne(() => User)
  public user: User;

  public constructor() {
    super();
  }
}

@ChildEntity(RequestType.TypeB)
export class RequestTypeB extends Request {
  public override type: typeof RequestType.TypeB;

  @Column({ name: 'specificPropertyB', type: 'varchar', length: 255 })
  public specificPropertyB: string;

  public constructor() {
    super();
  }
}

@ChildEntity(RequestType.TypeC)
export class RequestTypeC extends Request {
  public override type: typeof RequestType.TypeC;

  @Column({ name: 'specificPropertyC', type: 'varchar', length: 255 })
  public specificPropertyC: string;

  public constructor() {
    super();
  }
}
