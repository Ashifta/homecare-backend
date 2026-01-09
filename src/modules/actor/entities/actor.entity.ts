import { Index, Unique, 
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('actors')
@Index(['tenantId'])
export class ActorEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  tenantId!: string;

  @Column({ type: 'varchar' })
  type!: 'RECEIVER' | 'PROVIDER' | 'CENTRAL';

  @Column()
  subType!: string;

  @Column({ default: 'ACTIVE' })
  status!: 'ACTIVE' | 'SUSPENDED' | 'TERMINATED';

  @Column({ type: 'jsonb', nullable: true })
  metadata!: Record<string, any>;

  @CreateDateColumn()
  createdAt!: Date;
}
