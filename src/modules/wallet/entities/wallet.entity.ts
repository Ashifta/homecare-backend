
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

export enum WalletOwnerType {
  PLATFORM = 'PLATFORM',
  PROVIDER = 'PROVIDER',
  RECEIVER = 'RECEIVER',
  INSURANCE = 'INSURANCE',
  CHARITY = 'CHARITY',
  TENANT = 'TENANT',
}

@Entity('wallets')
@Index(['tenantId', 'ownerType', 'ownerId'], { unique: true })
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id!:string;

  @Column()
  tenantId!:string;

  @Column({ type:'enum', enum: WalletOwnerType })
  ownerType!:WalletOwnerType;

  @Column()
  ownerId!:string;

  @Column({ default: 'INR' })
  currency!:string;

  @CreateDateColumn()
  createdAt!:Date;
}
