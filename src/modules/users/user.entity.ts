import { Column, Entity, OneToMany } from 'typeorm';
import { UserRole } from './users.interface';
import { Auth } from '../auth/auth.entity';
import { BaseUuidEntity } from '../database/base.entity';

@Entity('user')
export class User extends BaseUuidEntity {
  @Column({ name: 'lastName', type: 'varchar', length: 32, comment: '성' })
  public lastName: string;

  @Column({ name: 'firstName', type: 'varchar', length: 32, comment: '이름' })
  public firstName: string;

  @Column({ name: 'alias', type: 'varchar', length: 40, comment: '별칭' })
  public alias: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.GUEST, comment: '권한' })
  public role: UserRole = UserRole.GUEST;

  @Column({ name: 'phone', type: 'varchar', length: 16, nullable: true, comment: '전화번호' })
  public phone!: string | null;

  @OneToMany(() => Auth, (auth) => auth.user, { cascade: ['soft-remove', 'insert', 'update'] })
  public auths: Auth[];

  public constructor() {
    super();
  }
}
