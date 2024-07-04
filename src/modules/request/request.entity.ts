import { ChildEntity, Column, Entity, ManyToOne, TableInheritance, VirtualColumn } from 'typeorm';
import { RequestSubType, RequestType } from './request.interface';
import { BaseUuidActorEntity } from '../database/base.entity';
import { User } from '../users/entities/user.entity';

export type IRequest = RequestTypeA | RequestTypeB | RequestTypeC;

@Entity('request')
@TableInheritance({
  column: {
    type: 'enum',
    enum: RequestType,
    name: 'type',
    comment: 'discrimination key',
  },
})
export class Request extends BaseUuidActorEntity {
  @Column({ type: 'enum', enum: RequestType, name: 'type' })
  public type: RequestType;

  @Column({ type: 'enum', enum: RequestSubType, name: 'subType' })
  public subType: RequestSubType;

  @VirtualColumn({
    type: 'string',
    query: (alias) => `SELECT CONCAT(type, subType) FROM 'request' where id = ${alias}`,
  })
  public discriminationKey: string;

  @Column({ name: 'additionalData1', type: 'varchar', length: 255 })
  public additionalData1: string;

  @Column({ name: 'additionalData2', type: 'varchar', length: 255 })
  public additionalData2: string;

  @Column({ name: 'additionalData3', type: 'varchar', length: 255 })
  public additionalData3: string;
}

@ChildEntity(RequestType.TypeA)
export class RequestTypeA extends Request {
  public override readonly type: typeof RequestType.TypeA = RequestType.TypeA;

  @Column({ name: 'specificPropertyA', type: 'varchar', length: 255 })
  public specificPropertyA: string;

  @ManyToOne(() => User)
  public user?: User;

  public constructor() {
    super();
  }
}

@ChildEntity(RequestType.TypeB)
export class RequestTypeB extends Request {
  public override readonly type: typeof RequestType.TypeB = RequestType.TypeB;

  @Column({ name: 'specificPropertyB', type: 'varchar', length: 255 })
  public specificPropertyB: string;

  public constructor() {
    super();
  }
}

@ChildEntity(RequestType.TypeC)
export class RequestTypeC extends Request {
  public override readonly type: typeof RequestType.TypeC = RequestType.TypeC;

  @Column({ name: 'specificPropertyC', type: 'varchar', length: 255 })
  public specificPropertyC: string;

  public constructor() {
    super();
  }
}
