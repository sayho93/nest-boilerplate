import type { User } from 'src/users/entities/user.entity';
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

export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ update: false })
  @Index()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true, select: true })
  deletedAt: Date | null;
}

export abstract class BaseActorEntity extends BaseEntity {
  @ManyToOne('User', 'id')
  @JoinColumn()
  createdBy: Relation<User>;

  // @OneToMany(() => User, user => user.id, {cascade: true, onDelete: 'CASCADE'})
  @ManyToOne('User', 'id')
  @JoinColumn()
  updatedBy: Relation<User>;

  @ManyToOne('User', 'id')
  @JoinColumn()
  deletedBy: Relation<User>;
}
