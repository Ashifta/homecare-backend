import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';
import { Role } from '../../common/rbac/roles.enum';

@Entity('user_roles')
export class UserRole {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column()
  tenantId!: string;

  @Index()
  @Column()
  userId!: string;

  @Column({ type: 'enum', enum: Role })
  role!:Role;

  @Column({ default: true })
  isActive!: boolean;
}
