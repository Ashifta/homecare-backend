
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

export enum PayoutMethod {
  UPI = 'UPI',
  BANK = 'BANK',
  CASH = 'CASH',
}

@Entity('payouts')
@Index(['tenantId', 'walletId', 'date'], { unique: true })
export class Payout {
  @PrimaryGeneratedColumn('uuid')
  id!:string;

  @Column()
  tenantId!:string;

  @Column()
  walletId!:string;

  @Column('decimal', { precision: 12, scale: 2 })
  amount!:string;

  @Column({ type: 'enum', enum: PayoutMethod })
  method!:PayoutMethod;

  @Column()
  reference!:string;

  @Column({ type: 'date' })
  date!:string;

  @CreateDateColumn()
  createdAt!:Date;
}
