import { ChildEntity, Column, Entity, ManyToOne, TableInheritance } from 'typeorm';
import { RequestSubType, RequestTupleType, RequestType } from './request.interface';
import { BaseUuidActorEntity } from '../database/base.entity';
import { Project } from '../projects/entities/project.entity';
import { User } from '../users/entities/user.entity';

export type IRequest =
  | RequestTypeAA
  | RequestTypeAB
  | RequestTypeAC
  | RequestTypeBA
  | RequestTypeBB
  | RequestTypeBC
  | RequestTypeCA
  | RequestTypeCB
  | RequestTypeCC;

@Entity('request')
@TableInheritance({
  column: {
    type: 'simple-array',
    // enum: [...Object.values(RequestType), ...Object.values(RequestSubType)],
    name: 'type',
    // default: [RequestType.TypeA, RequestSubType.SubTypeA],
  },
})
export class Request extends BaseUuidActorEntity {
  public type: RequestTupleType;

  @Column({ name: 'additionalData1', type: 'varchar', length: 255 })
  public additionalData1: string;

  @Column({ name: 'additionalData2', type: 'varchar', length: 255 })
  public additionalData2: string;

  @Column({ name: 'additionalData3', type: 'varchar', length: 255 })
  public additionalData3: string;

  public static isRequestTypeAA(request: IRequest): request is RequestTypeAA {
    return request.type[0] === RequestType.TypeA && request.type[1] === RequestSubType.SubTypeA;
  }

  public static isRequestTypeAB(request: IRequest): request is RequestTypeAB {
    return request.type[0] === RequestType.TypeA && request.type[1] === RequestSubType.SubTypeB;
  }

  public static isRequestTypeAC(request: IRequest): request is RequestTypeAC {
    return request.type[0] === RequestType.TypeA && request.type[1] === RequestSubType.SubTypeC;
  }

  public static isRequestTypeBA(request: IRequest): request is RequestTypeBA {
    return request.type[0] === RequestType.TypeB && request.type[1] === RequestSubType.SubTypeA;
  }

  public static isRequestTypeBB(request: IRequest): request is RequestTypeBB {
    return request.type[0] === RequestType.TypeB && request.type[1] === RequestSubType.SubTypeB;
  }

  public static isRequestTypeBC(request: IRequest): request is RequestTypeBC {
    return request.type[0] === RequestType.TypeB && request.type[1] === RequestSubType.SubTypeC;
  }

  public static isRequestTypeCA(request: IRequest): request is RequestTypeCA {
    return request.type[0] === RequestType.TypeC && request.type[1] === RequestSubType.SubTypeA;
  }

  public static isRequestTypeCB(request: IRequest): request is RequestTypeCB {
    return request.type[0] === RequestType.TypeC && request.type[1] === RequestSubType.SubTypeB;
  }

  public static isRequestTypeCC(request: IRequest): request is RequestTypeCC {
    return request.type[0] === RequestType.TypeC && request.type[1] === RequestSubType.SubTypeC;
  }
}

@ChildEntity([RequestType.TypeA, RequestSubType.SubTypeA])
export class RequestTypeAA extends Request {
  public override readonly type: [typeof RequestType.TypeA, typeof RequestSubType.SubTypeA] = [
    RequestType.TypeA,
    RequestSubType.SubTypeA,
  ] as const;

  @Column({ name: 'specificProperty1', type: 'varchar', length: 255 })
  public specificProperty1: string;

  @ManyToOne(() => User)
  public user?: User;

  public constructor() {
    super();
  }
}

@ChildEntity([RequestType.TypeA, RequestSubType.SubTypeB])
export class RequestTypeAB extends Request {
  public override readonly type: [typeof RequestType.TypeA, typeof RequestSubType.SubTypeB] = [
    RequestType.TypeA,
    RequestSubType.SubTypeB,
  ] as const;

  @Column({ name: 'specificProperty2', type: 'varchar', length: 255 })
  public specificProperty2: string;

  public constructor() {
    super();
  }
}

@ChildEntity([RequestType.TypeA, RequestSubType.SubTypeC])
export class RequestTypeAC extends Request {
  public override readonly type: [typeof RequestType.TypeA, typeof RequestSubType.SubTypeC] = [
    RequestType.TypeA,
    RequestSubType.SubTypeC,
  ] as const;

  @Column({ name: 'specificProperty3', type: 'varchar', length: 255 })
  public specificProperty3: string;

  public constructor() {
    super();
  }
}

@ChildEntity([RequestType.TypeB, RequestSubType.SubTypeA])
export class RequestTypeBA extends Request {
  public override readonly type: [typeof RequestType.TypeB, typeof RequestSubType.SubTypeA] = [
    RequestType.TypeB,
    RequestSubType.SubTypeA,
  ] as const;

  @Column({ name: 'specificProperty4', type: 'varchar', length: 255 })
  public specificProperty4: string;

  public constructor() {
    super();
  }
}

@ChildEntity([RequestType.TypeB, RequestSubType.SubTypeB])
export class RequestTypeBB extends Request {
  public override readonly type: [typeof RequestType.TypeB, typeof RequestSubType.SubTypeB] = [
    RequestType.TypeB,
    RequestSubType.SubTypeB,
  ] as const;

  @Column({ name: 'specificProperty5', type: 'varchar', length: 255 })
  public specificProperty5: string;

  public constructor() {
    super();
  }
}

@ChildEntity([RequestType.TypeB, RequestSubType.SubTypeC])
export class RequestTypeBC extends Request {
  public override readonly type: [typeof RequestType.TypeB, typeof RequestSubType.SubTypeC] = [
    RequestType.TypeB,
    RequestSubType.SubTypeC,
  ] as const;

  @Column({ name: 'specificProperty6', type: 'varchar', length: 255 })
  public specificProperty6: string;

  public constructor() {
    super();
  }
}

@ChildEntity([RequestType.TypeC, RequestSubType.SubTypeA])
export class RequestTypeCA extends Request {
  public override readonly type: [typeof RequestType.TypeC, typeof RequestSubType.SubTypeA] = [
    RequestType.TypeC,
    RequestSubType.SubTypeA,
  ] as const;

  @Column({ name: 'specificProperty7', type: 'varchar', length: 255 })
  public specificProperty7: string;

  public constructor() {
    super();
  }
}

@ChildEntity([RequestType.TypeC, RequestSubType.SubTypeB])
export class RequestTypeCB extends Request {
  public override readonly type: [typeof RequestType.TypeC, typeof RequestSubType.SubTypeB] = [
    RequestType.TypeC,
    RequestSubType.SubTypeB,
  ] as const;

  @Column({ name: 'specificProperty8', type: 'varchar', length: 255 })
  public specificProperty8: string;

  public constructor() {
    super();
  }
}

@ChildEntity([RequestType.TypeC, RequestSubType.SubTypeC])
export class RequestTypeCC extends Request {
  public override readonly type: [typeof RequestType.TypeC, typeof RequestSubType.SubTypeC] = [
    RequestType.TypeC,
    RequestSubType.SubTypeC,
  ] as const;

  @Column({ name: 'specificProperty9', type: 'varchar', length: 255 })
  public specificProperty9: string;

  @ManyToOne(() => Project)
  public project?: Project;

  public constructor() {
    super();
  }
}
