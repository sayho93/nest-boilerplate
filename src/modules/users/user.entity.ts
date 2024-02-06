import { Column, Entity, OneToMany } from 'typeorm';
import { UserRole } from './users.interface';
import { Auth } from '../auth/auth.entity';
import { BaseEntity } from '../database/base.entity';

@Entity('user')
export class User extends BaseEntity {
  @Column({ name: 'lastName', type: 'varchar', length: 16, comment: '성' })
  public lastName: string;

  @Column({ name: 'firstName', type: 'varchar', length: 16, comment: '이름' })
  public firstName: string;

  @Column({ name: 'alias', type: 'varchar', length: 40, comment: '별칭' })
  public alias: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.GUEST, comment: '권한' })
  role: UserRole = UserRole.GUEST;

  @Column({ name: 'phone', type: 'varchar', length: 16, nullable: true, comment: '전화번호' })
  public phone!: string | null;

  @OneToMany(() => Auth, (auth) => auth.user)
  auths: Auth[];

  public constructor() {
    super();
  }
}
