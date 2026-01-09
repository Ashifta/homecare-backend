import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { FundSource } from './fund-source.entity';
import { BaseTenantRepository } from 'src/common/database/base-tenant.repository';

@Injectable()
export class FundSourceRepository extends BaseTenantRepository<FundSource> {
  constructor(dataSource: DataSource) {
    super(FundSource, dataSource.createEntityManager());
  }
}
