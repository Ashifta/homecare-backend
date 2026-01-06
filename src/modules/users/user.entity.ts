import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('users')
@Index(['tenantId', 'phoneNumber'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * Tenant (city/operator) isolation
   */
  @Column({ type: 'uuid' })
  tenantId!: string;

  /**
   * OTP-only authentication identifier
   * Stored once per tenant
   */
  @Column({ length: 20 })
  phoneNumber!: string;


  /**
   * Audit fields
   */
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
