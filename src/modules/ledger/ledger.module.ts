
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LedgerEntry } from './ledger-entry.entity';
import { LedgerService } from './ledger.service';

import{ LedgerRepository } from './ledger.repository';

@Module({
  imports: [TypeOrmModule.forFeature([LedgerEntry])],
  providers: [LedgerService, LedgerRepository],
  exports: [LedgerService],
})
export class LedgerModule {}
