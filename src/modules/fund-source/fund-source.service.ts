import { Injectable } from '@nestjs/common';
import { FundSource } from './fund-source.entity';
import { FundSourceType } from './fund-source-type.enum';
import { FundSourceRepository } from './fund-source.repository';

@Injectable()
export class FundSourceService {
  constructor(
    private readonly repo: FundSourceRepository,
  ) {}

  async createDefaultReceiverFundSource(walletId: string) {
    const fs = this.repo.createForTenant({
      walletId,
      type: FundSourceType.CASH,
      isActive: true,
    });

    return this.repo.save(fs);
  }

  async getById(id: string) {
    return this.repo.findOne({
      where: { id },
    });
  }
}
