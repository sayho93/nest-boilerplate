import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseUuidActorEntity } from '../../database/base.entity';
import { User } from '../../users/user.entity';

@Entity('credit')
export class Credit extends BaseUuidActorEntity {
  @ManyToOne(() => User, (user) => user.credits)
  user: User;

  @Column({ name: 'variance', type: 'int', comment: '변화량' })
  variance: number;

  @Column({ name: 'context', type: 'varchar', length: 255, comment: 'credit 부여/차감 컨텍스트' })
  context: string;
}
