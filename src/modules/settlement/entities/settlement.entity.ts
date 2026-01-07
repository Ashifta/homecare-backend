
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('settlements')
@Index(['tenantId', 'paymentId'], { unique: true })
export class Settlement {
  @PrimaryGeneratedColumn('uuid')
  id!:string;

  @Column()
  tenantId!:string;

  @Column()
  paymentId!:string;

  @CreateDateColumn()
  settledAt!:Date;
}
