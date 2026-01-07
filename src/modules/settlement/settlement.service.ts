import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Settlement } from './entities/settlement.entity';
import { Payment, PaymentStatus } from '../payment/entities/payment.entity';
import { LedgerService } from '../ledger/ledger.service';
import { LedgerEntryType } from '../ledger/entities/ledger-entry.entity';

@Injectable()
export class SettlementService {
  private readonly logger = new Logger(SettlementService.name);

  constructor(
    private readonly ledgerService: LedgerService,

    @InjectRepository(Settlement)
    private readonly settlementRepo: Repository<Settlement>,

    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
  ) {}

  /**
   * Settle a single payment.
   * SAFE, IDEMPOTENT, AUDITABLE.
   */
  async settlePayment(paymentId: string): Promise<void> {
    const payment = await this.paymentRepo.findOne({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new BadRequestException('Payment not found');
    }

    if (payment.status !== PaymentStatus.SUCCESS) {
      throw new BadRequestException('Payment not eligible for settlement');
    }

    const alreadySettled = await this.settlementRepo.findOne({
      where: {
        tenantId: payment.tenantId,
        paymentId: payment.id,
      },
    });

    if (alreadySettled) {
      this.logger.debug(`Payment ${payment.id} already settled`);
      return;
    }

    // 1️⃣ Debit payer wallet
    await this.ledgerService.record({
      tenantId: payment.tenantId,
      walletId: payment.payerWalletId,
      amount: payment.amount,
      type: LedgerEntryType.DEBIT,
      reason: 'Session payment',
      referenceType: 'PAYMENT',
      referenceId: payment.id,
    });

    // 2️⃣ Credit payee wallet
    await this.ledgerService.record({
      tenantId: payment.tenantId,
      walletId: payment.payeeWalletId,
      amount: payment.amount,
      type: LedgerEntryType.CREDIT,
      reason: 'Session earnings',
      referenceType: 'PAYMENT',
      referenceId: payment.id,
    });

    // 3️⃣ Mark settlement
    await this.settlementRepo.save(
      this.settlementRepo.create({
        tenantId: payment.tenantId,
        paymentId: payment.id,
      }),
    );

    this.logger.log(`Settled payment ${payment.id}`);
  }
}
