
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

export enum PaymentStatus {
  INITIATED = 'INITIATED',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export enum PaymentMethod {
  UPI = 'UPI',
  INSURANCE = 'INSURANCE',
  CHARITY = 'CHARITY',
}

@Entity('payments')
@Index(['tenantId', 'appointmentId'], { unique: true })
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id!:string;

  @Column()
  tenantId!:string;

  @Column()
  appointmentId!:string;

  @Column()
  payerWalletId!:string;

  @Column()
  payeeWalletId!:string;

  @Column('decimal', { precision: 12, scale: 2 })
  amount!:string;

  @Column({ type: 'enum', enum: PaymentStatus })
  status!:PaymentStatus;

  @Column({ type: 'enum', enum: PaymentMethod })
  method!:PaymentMethod;

  @CreateDateColumn()
  createdAt!:Date;
}
