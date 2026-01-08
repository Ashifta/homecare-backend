import { LedgerModule } from '../ledger/ledger.module';

import { Module, forwardRef } from '@nestjs/common';
import { FundSourceModule } from '../fund-source/fund-source.module';
import { SettlementService } from './settlement.service';
import { AppointmentModule } from '../appointment/appointment.module';


@Module({
  imports: [FundSourceModule, LedgerModule, forwardRef(() => AppointmentModule), // ✅
],
  providers: [SettlementService],
  exports: [SettlementService],
})
export class SettlementModule {}
