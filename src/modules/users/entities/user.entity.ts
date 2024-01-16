import { BaseEntity } from 'src/common/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @Column({ type: String })
  email: string;

  @Column({ type: String })
  name: string;

  @Column({ type: String })
  alias: string;

  @Column({ type: String, nullable: true })
  phone!: string | null;

  @Column({ type: String, nullable: true })
  profileImage: string | null;
}
