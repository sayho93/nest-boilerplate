import { Exclude } from 'class-transformer';
import { Column, Entity, ManyToOne } from 'typeorm';
import { AuthType } from './auth.interface';
import { BaseEntity } from '../database/base.entity';
import { User } from '../users/user.entity';

@Entity('auth')
export class Auth extends BaseEntity {
  @ManyToOne(() => User)
  user: User;

  @Column({ type: 'enum', enum: AuthType, comment: '인증타입' })
  type: AuthType;

  @Column({ unique: true, name: 'email', type: 'varchar', length: 64, update: false, comment: '이메일' })
  email: string;

  @Exclude({ toPlainOnly: true })
  @Column({ name: 'password', type: 'varchar', length: 256, comment: '비밀번호' })
  password: string;

  @Exclude({ toPlainOnly: true })
  @Column({ type: 'varchar', length: 256, comment: 'token' })
  token: string;

  @Column({ type: 'varchar', length: 256, comment: 'token' })
  test: string;

  @Column({ type: 'varchar', length: 256, comment: 'token' })
  test2: string;

  @Column({ type: 'varchar', length: 256, comment: 'token' })
  test3: string;
}
