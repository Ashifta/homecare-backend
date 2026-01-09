import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from './user.entity';
import { BaseTenantRepository } from 'src/common/database/base-tenant.repository';

@Injectable()
export class UserRepository extends BaseTenantRepository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }
}
