
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FundSource } from './fund-source.entity';
import { FundSourceType } from './fund-source-type.enum';

@Injectable()
export class FundSourceService {
  constructor(
    @InjectRepository(FundSource)
    private readonly repo: Repository<FundSource>,
  ) {}

  async createDefaultReceiverFundSource(tenantId: string, walletId: string) {
    const fs = this.repo.create({
      tenantId,
      type: FundSourceType.RECEIVER,
      walletId,
      isActive: true,
    });
    return this.repo.save(fs);
  }

  async getById(id: string) {
    return this.repo.findOne({ where: { id } });
  }
}
