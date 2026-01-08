
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LedgerEntry } from './ledger-entry.entity';
import { Between } from 'typeorm';

@Injectable()
export class LedgerService {
  constructor(
    @InjectRepository(LedgerEntry)
    private readonly repo: Repository<LedgerEntry>,
  ) {}

  async record(entry: Partial<LedgerEntry>) {
    const e = this.repo.create(entry);
    return this.repo.save(e);
  }
  async sumByMonth(
  walletId: string,
  direction: 'CREDIT' | 'DEBIT',
  year: number,
  month: number,
): Promise<number> {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59);

  const qb = this.repo
    .createQueryBuilder('l')
    .select('SUM(l.amount)', 'total')
    .where(
      direction === 'CREDIT'
        ? 'l.creditWalletId = :walletId'
        : 'l.debitWalletId = :walletId',
      { walletId },
    )
    .andWhere('l.createdAt BETWEEN :start AND :end', { start, end });

  const result = await qb.getRawOne<{ total: string }>();
  return Number(result?.total ?? 0);
}

async sumByYear(
  walletId: string,
  year: number,
): Promise<number> {
  const start = new Date(year, 0, 1); // Jan 1
  const end = new Date(year, 11, 31, 23, 59, 59); // Dec 31

  const creditQb = this.repo
    .createQueryBuilder('l')
    .select('SUM(l.amount)', 'total')
    .where('l.creditWalletId = :walletId', { walletId })
    .andWhere('l.createdAt BETWEEN :start AND :end', { start, end });

  const debitQb = this.repo
    .createQueryBuilder('l')
    .select('SUM(l.amount)', 'total')
    .where('l.debitWalletId = :walletId', { walletId })
    .andWhere('l.createdAt BETWEEN :start AND :end', { start, end });

  const credit = await creditQb.getRawOne<{ total: string }>();
  const debit = await debitQb.getRawOne<{ total: string }>();

  return (
    Number(credit?.total ?? 0) -
    Number(debit?.total ?? 0)
  );
}

}
