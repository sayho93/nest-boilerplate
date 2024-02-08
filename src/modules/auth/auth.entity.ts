import { Exclude } from 'class-transformer';
import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { AuthType } from './auth.interface';
import { createHash } from '../../common/utils/encrypt';
import { BaseUuidEntity } from '../database/base.entity';
import { User } from '../users/user.entity';

@Entity('auth')
@Index(['deletedAt', 'email'], { unique: true, nullFiltered: true })
export class Auth extends BaseUuidEntity {
  @ManyToOne(() => User, (user) => user.auths, { onDelete: 'CASCADE' })
  public user: User;

  @Column({ type: 'enum', enum: AuthType, comment: '인증타입' })
  public type: AuthType;

  // @Index({ unique: true, where: 'deletedAt IS NULL AND email IS NOT NULL' })
  @Column({ name: 'email', nullable: true, type: 'varchar', length: 64, update: false, comment: '이메일' })
  public email: string;

  @Exclude({ toPlainOnly: true })
  @Column({ name: 'password', nullable: true, type: 'varchar', length: 256, comment: '비밀번호' })
  private password: string;

  @Exclude({ toPlainOnly: true })
  @Column({ type: 'varchar', nullable: true, length: 256, comment: 'token' })
  public token: string;

  public async setPassword(plainPassword: string) {
    this.password = await createHash(plainPassword);
  }

  public getPassword(): string {
    return this.password;
  }

  public constructor(type: AuthType) {
    super();
    this.type = type;
  }
}
