
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LedgerEntry, LedgerEntryType } from './entities/ledger-entry.entity';

@Injectable()
export class LedgerService {
  constructor(
    @InjectRepository(LedgerEntry)
    private readonly ledgerRepo: Repository<LedgerEntry>,
  ) {}

  async record(entry: {
    tenantId: string;
    walletId: string;
    amount: string;
    type: LedgerEntryType;
    reason: string;
    referenceType: string;
    referenceId: string;
  }) {
    return this.ledgerRepo.save(this.ledgerRepo.create(entry));
  }

  async sumByMonth(walletId: string, type: LedgerEntryType, year: number, month: number) {
    const r = await this.ledgerRepo.createQueryBuilder('l')
      .select('SUM(l.amount)', 'total')
      .where('l.walletId = :walletId', { walletId })
      .andWhere('l.type = :type', { type })
      .andWhere('EXTRACT(YEAR FROM l.createdAt) = :year', { year })
      .andWhere('EXTRACT(MONTH FROM l.createdAt) = :month', { month })
      .getRawOne();
    return Number(r?.total || 0);
  }

  async sumByYear(walletId: string, year: number) {
    const r = await this.ledgerRepo.createQueryBuilder('l')
      .select('SUM(l.amount)', 'total')
      .where('l.walletId = :walletId', { walletId })
      .andWhere('l.type = :type', { type: LedgerEntryType.CREDIT })
      .andWhere('EXTRACT(YEAR FROM l.createdAt) = :year', { year })
      .getRawOne();
    return Number(r?.total || 0);
  }
}
