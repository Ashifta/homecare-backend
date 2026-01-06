import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from '../../modules/users/user.entity';
import { UserRole } from '../../modules/users/user-role.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,

  // 🔴 REQUIRED
  entities: [
    User,
    UserRole,
  ],

  migrationsTableName: 'typeorm_migrations',
  migrations: ['dist/migrations/*.js'],
  synchronize: true,
  logging: false,
});

