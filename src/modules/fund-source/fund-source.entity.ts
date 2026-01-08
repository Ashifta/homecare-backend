
import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';
import { FundSourceType } from './fund-source-type.enum';

@Entity('fund_sources')
export class FundSource {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column()
  tenantId!: string;

  @Column({ type: 'enum', enum: FundSourceType })
  type!: FundSourceType;

  @Column()
  walletId!: string;

  @Column({ nullable: true })
  referenceId?: string;

  @Column({ default: true })
  isActive!: boolean;
}
