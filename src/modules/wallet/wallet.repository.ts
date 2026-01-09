import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { BaseTenantRepository } from 'src/common/database/base-tenant.repository';

@Injectable()
export class WalletRepository extends BaseTenantRepository<Wallet> {
  constructor(dataSource: DataSource) {
    super(Wallet, dataSource.createEntityManager());
  }
}
