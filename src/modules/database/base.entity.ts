import type { User } from 'src/modules/users/user.entity';
import {
  CreateDateColumn,
  DeleteDateColumn,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

export class FundamentalEntity {
  @Index()
  @CreateDateColumn({ name: 'createdAt', update: false })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  public updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', nullable: true, default: null, select: true })
  public deletedAt: Date | null;

  protected constructor() {}
}

export class BaseAutoIncrementEntity extends FundamentalEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  public id: number;

  protected constructor() {
    super();
  }
}

export class BaseUuidEntity extends FundamentalEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  public id: string;

  protected constructor() {
    super();
  }
}

export class BaseAutoIncrementActorEntity extends BaseAutoIncrementEntity {
  @ManyToOne('User', 'id')
  @JoinColumn({ name: 'createdBy' })
  public createdBy: Relation<User>;

  // @OneToMany(() => User, user => user.id, {cascade: true, onDelete: 'CASCADE'})
  @ManyToOne('User', 'id')
  @JoinColumn({ name: 'updatedBy' })
  public updatedBy: Relation<User>;

  @ManyToOne('User', 'id')
  @JoinColumn({ name: 'deletedBy' })
  public deletedBy: Relation<User>;

  protected constructor() {
    super();
  }
}

export class BaseUuidActorEntity extends BaseUuidEntity {
  @ManyToOne('User', 'id')
  @JoinColumn({ name: 'createdBy' })
  public createdBy: Relation<User>;

  @ManyToOne('User', 'id')
  @JoinColumn({ name: 'updatedBy' })
  public updatedBy: Relation<User>;

  @ManyToOne('User', 'id')
  @JoinColumn({ name: 'deletedBy' })
  public deletedBy: Relation<User>;

  protected constructor() {
    super();
  }
}
