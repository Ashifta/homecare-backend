
import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn } from 'typeorm';

@Entity('ledger_entries')
export class LedgerEntry {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column()
  tenantId!: string;

  @Column()
  debitWalletId!: string;

  @Column()
  creditWalletId!: string;

  @Column('decimal')
  amount!: number;

  @Column()
  referenceType!: string;

  @Column()
  referenceId!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
