import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Auth } from '../../auth/entities/auth.entity';
import { Credit } from '../../credits/entities/credit.entity';
import { BaseUuidEntity } from '../../database/base.entity';
import { UserRole } from '../users.interface';

@Entity('user')
export class User extends BaseUuidEntity {
  @Column({ name: 'lastName', type: 'varchar', length: 32, comment: '성' })
  public lastName: string;

  @Column({ name: 'firstName', type: 'varchar', length: 32, comment: '이름' })
  public firstName: string;

  @Column({ name: 'alias', type: 'varchar', length: 40, comment: '별칭' })
  public alias: string;

  @Column({ name: 'role', type: 'enum', enum: UserRole, default: UserRole.GUEST, comment: '권한' })
  public role: UserRole = UserRole.GUEST;

  @Index({ unique: true, nullFiltered: true })
  @Column({ name: 'phone', type: 'varchar', nullable: true, length: 16, comment: '전화번호' })
  public phone: string | null;

  @OneToMany(() => Auth, (auth) => auth.user, { cascade: ['soft-remove', 'insert', 'update'] })
  public auths: Auth[];

  @OneToMany(() => Credit, (credit) => credit.user, { cascade: ['soft-remove', 'insert', 'update'] })
  public credits: Credit[];

  public constructor() {
    super();
  }
}
