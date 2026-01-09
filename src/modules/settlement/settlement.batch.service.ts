import { getTenantId } from 'src/common/tenant/tenant.helper';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Payment, PaymentStatus } from '../payment/entities/payment.entity';
import { SettlementService } from './settlement.service';

@Injectable()
export class SettlementBatchService {
  private readonly logger = new Logger(SettlementBatchService.name);

  constructor(
    private readonly settlementService: SettlementService,

    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
  ) {}

  /**
   * Run daily settlement for a tenant.
   * SAFE, IDEMPOTENT, CAN BE RE-RUN.
   */
  async runDailySettlement(tenantId: string, date: Date) {
    this.logger.log(
      `Running daily settlement for tenant ${tenantId} on ${date.toISOString()}`,
    );

    const payments = await this.paymentRepo.find({
      where: {
        tenantId,
        status: PaymentStatus.SUCCESS,
      },
    });

    let settledCount = 0;

    for (const payment of payments) {
      await this.settlementService.settlePayment(payment.id);
      settledCount++;
    }

    this.logger.log(
      `Daily settlement completed for tenant ${tenantId}. Settled payments: ${settledCount}`,
    );

    return {
      tenantId,
      date,
      settledPayments: settledCount,
    };
  }
}
