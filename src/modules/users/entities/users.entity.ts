import { Column, Entity } from 'typeorm';
import { Union } from '../../../common/types/union.type';
import { BaseEntity } from '../../database/base.entity';

export const UserRole = {
  ADMIN: 'admin',
  MEMBER: 'member',
  GUEST: 'guest',
};

export type UserRole = Union<typeof UserRole>;

@Entity('user')
export class UsersEntity extends BaseEntity {
  @Column({ unique: true, name: 'email', type: 'varchar', length: 64, update: false, comment: '이메일' })
  public email: string;

  @Column({ name: 'password', type: 'varchar', length: 256, comment: '비밀번호' })
  password: string;

  @Column({ name: 'name', type: 'varchar', length: 40, comment: '이름' })
  public name: string;

  @Column({ name: 'alias', type: 'varchar', length: 40, comment: '별칭' })
  public alias: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.GUEST, comment: '권한' })
  role: UserRole = UserRole.GUEST;

  @Column({ name: 'phone', type: 'varchar', length: 16, nullable: true, comment: '전화번호' })
  public phone!: string | null;

  public constructor() {
    super();
  }
}
