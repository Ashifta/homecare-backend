import { Injectable } from '@nestjs/common';
import { LedgerEntry } from './ledger-entry.entity';
import { LedgerRepository } from './ledger.repository';
import { getTenantId } from 'src/common/tenant/tenant.helper';

@Injectable()
export class LedgerService {
  constructor(
    private readonly repo: LedgerRepository,
  ) {}

  /**
   * Record a ledger entry (tenant injected automatically)
   */
  async record(entry: Partial<LedgerEntry>) {
    const e = this.repo.createForTenant(entry);
    return this.repo.save(e);
  }

  async sumByMonth(
    walletId: string,
    direction: 'CREDIT' | 'DEBIT',
    year: number,
    month: number,
  ): Promise<number> {
    const tenantId = getTenantId();
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
      // 🔐 CRITICAL: tenant enforcement
      .andWhere('l.tenantId = :tenantId', { tenantId })
      .andWhere('l.createdAt BETWEEN :start AND :end', { start, end });

    const result = await qb.getRawOne<{ total: string }>();
    return Number(result?.total ?? 0);
  }

  async sumByYear(
    walletId: string,
    year: number,
  ): Promise<number> {
    const tenantId = getTenantId();
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31, 23, 59, 59);

    const creditQb = this.repo
      .createQueryBuilder('l')
      .select('SUM(l.amount)', 'total')
      .where('l.creditWalletId = :walletId', { walletId })
      .andWhere('l.tenantId = :tenantId', { tenantId })
      .andWhere('l.createdAt BETWEEN :start AND :end', { start, end });

    const debitQb = this.repo
      .createQueryBuilder('l')
      .select('SUM(l.amount)', 'total')
      .where('l.debitWalletId = :walletId', { walletId })
      .andWhere('l.tenantId = :tenantId', { tenantId })
      .andWhere('l.createdAt BETWEEN :start AND :end', { start, end });

    const credit = await creditQb.getRawOne<{ total: string }>();
    const debit = await debitQb.getRawOne<{ total: string }>();

    return (
      Number(credit?.total ?? 0) -
      Number(debit?.total ?? 0)
    );
  }
}
