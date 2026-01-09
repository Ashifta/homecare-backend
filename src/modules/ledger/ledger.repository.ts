import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { LedgerEntry } from './ledger-entry.entity';
import { BaseTenantRepository } from 'src/common/database/base-tenant.repository';

@Injectable()
export class LedgerRepository extends BaseTenantRepository<LedgerEntry> {
  constructor(dataSource: DataSource) {
    super(LedgerEntry, dataSource.createEntityManager());
  }
}
