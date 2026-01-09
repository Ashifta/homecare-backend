import { getTenantId } from 'src/common/tenant/tenant.helper';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payout, PayoutMethod } from './entities/payout.entity';

@Injectable()
export class PayoutService {
  constructor(
    @InjectRepository(Payout)
    private readonly payoutRepo: Repository<Payout>,
  ) {}

  /**
   * Mark a payout as completed (manual UPI / bank / cash).
   * This does NOT move money in ledger.
   */
  async markPayout(payload: {
    tenantId: string;
    walletId: string;
    amount: string;
    method: PayoutMethod;
    reference: string;
    date: string; // YYYY-MM-DD
  }) {
    const existing = await this.payoutRepo.findOne({
      where: {
        tenantId: payload.tenantId,
        walletId: payload.walletId,
        date: payload.date,
      },
    });

    if (existing) {
      throw new BadRequestException(
        'Payout already recorded for this wallet on this date',
      );
    }

    return this.payoutRepo.save(
      this.payoutRepo.create(payload),
    );
  }

  /**
   * Total amount paid to a wallet (lifetime)
   */
  async totalPaid(walletId: string): Promise<number> {
    const result = await this.payoutRepo
      .createQueryBuilder('p')
      .select('SUM(p.amount)', 'total')
      .where('p.walletId = :walletId', { walletId })
      .getRawOne();

    return Number(result?.total || 0);
  }

  /**
   * Total paid in a given month (used for salary slip)
   */
  async sumByMonth(
    walletId: string,
    year: number,
    month: number,
  ): Promise<number> {
    const result = await this.payoutRepo
      .createQueryBuilder('p')
      .select('SUM(p.amount)', 'total')
      .where('p.walletId = :walletId', { walletId })
      .andWhere('EXTRACT(YEAR FROM p.date) = :year', { year })
      .andWhere('EXTRACT(MONTH FROM p.date) = :month', { month })
      .getRawOne();

    return Number(result?.total || 0);
  }
}
