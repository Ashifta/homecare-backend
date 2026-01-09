// src/modules/central-assignment/entities/central-assignment.entity.ts
import { Index, Unique, 
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('central_assignments')
@Index(['tenantId'])
export class CentralAssignmentEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  tenantId!: string;

  @Column()
  centralActorId!: string;

  @Column({ default: 0 })
  providerCount!: number;

  @Column({ default: 'ACTIVE' })
  status!: 'ACTIVE' | 'PAUSED';

  @UpdateDateColumn()
  updatedAt!: Date;
}
