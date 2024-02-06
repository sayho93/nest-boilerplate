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

export class BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  public id: number;

  @Index()
  @CreateDateColumn({ name: 'createdAt', update: false })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  public updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', nullable: true, default: null, select: true })
  public deletedAt: Date | null;

  protected constructor() {}
}

export class BaseActorEntity extends BaseEntity {
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
