import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Settlement } from './entities/settlement.entity';
import { Payment } from '../payment/entities/payment.entity';
import { LedgerModule } from '../ledger/ledger.module';

import { SettlementService } from './settlement.service';
import { SettlementBatchService } from './settlement.batch.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Settlement, Payment]),
    LedgerModule,
  ],
  providers: [SettlementService, SettlementBatchService],
  exports: [SettlementService, SettlementBatchService],
})
export class SettlementModule {}
