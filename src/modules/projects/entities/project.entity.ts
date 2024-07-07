import { Column, Entity } from 'typeorm';
import { BaseUuidActorEntity } from '../../database/base.entity';

@Entity('project')
export class Project extends BaseUuidActorEntity {
  @Column({ name: 'name', type: 'varchar', length: 255 })
  public name: string;

  @Column({ name: 'description', type: 'varchar', length: 255 })
  public description: string;

  public constructor() {
    super();
  }
}
