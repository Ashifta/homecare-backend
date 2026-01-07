import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { LedgerModule } from '../ledger/ledger.module';
import { PayoutModule } from '../payout/payout.module';

@Module({
  imports: [LedgerModule, PayoutModule],
  providers: [ReportService],
  exports: [ReportService],
})
export class ReportModule {}
