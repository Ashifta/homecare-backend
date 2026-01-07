
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

export enum LedgerEntryType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
}

@Entity('ledger_entries')
@Index(['tenantId', 'walletId'])
@Index(['referenceType', 'referenceId'])
export class LedgerEntry {
  @PrimaryGeneratedColumn('uuid')
  id!:string;

  @Column()
  tenantId!:string;

  @Column()
  walletId!:string;

  @Column('decimal', { precision: 12, scale: 2 })
  amount!:string;

  @Column({ type: 'enum', enum: LedgerEntryType })
  type!:LedgerEntryType;

  @Column()
  reason!:string;

  @Column()
  referenceType!:string;

  @Column()
  referenceId!:string;

  @CreateDateColumn()
  createdAt!:Date;
}
