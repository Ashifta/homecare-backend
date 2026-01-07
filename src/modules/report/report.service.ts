
import { Injectable } from '@nestjs/common';
import { LedgerService } from '../ledger/ledger.service';
import { PayoutService } from '../payout/payout.service';

@Injectable()
export class ReportService {
  constructor(
    private readonly ledgerService: LedgerService,
    private readonly payoutService: PayoutService,
  ) {}

  async monthlySalary(walletId: string, year: number, month: number) {
    const earned = await this.ledgerService.sumByMonth(walletId, 'CREDIT' as any, year, month);
    const paid = await this.payoutService.sumByMonth(walletId, year, month);

    return {
      year,
      month,
      grossEarnings: earned,
      paidAmount: paid,
      outstanding: earned - paid,
    };
  }

  async yearlyITR(walletId: string, year: number) {
    return this.ledgerService.sumByYear(walletId, year);
  }
}
