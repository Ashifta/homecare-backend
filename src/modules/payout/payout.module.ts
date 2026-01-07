import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payout } from './entities/payout.entity';
import { PayoutService } from './payout.service';

@Module({
  imports: [TypeOrmModule.forFeature([Payout])],
  providers: [PayoutService],
  exports: [PayoutService],
})
export class PayoutModule {}
