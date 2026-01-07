import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Payment,
  PaymentMethod,
  PaymentStatus,
} from './entities/payment.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
  ) {}

  /**
   * Create a payment intent.
   * This does NOT move money.
   */
  async initiatePayment(payload: {
    tenantId: string;
    appointmentId: string;
    payerWalletId: string;
    payeeWalletId: string;
    amount: string;
    method: PaymentMethod;
  }): Promise<Payment> {
    const existing = await this.paymentRepo.findOne({
      where: {
        tenantId: payload.tenantId,
        appointmentId: payload.appointmentId,
      },
    });

    if (existing) {
      throw new BadRequestException(
        'Payment already exists for this appointment',
      );
    }

    const payment = this.paymentRepo.create({
      ...payload,
      status: PaymentStatus.INITIATED,
    });

    return this.paymentRepo.save(payment);
  }

  /**
   * Mark payment success (after UPI / insurance confirmation).
   */
  async markSuccess(paymentId: string): Promise<void> {
    await this.paymentRepo.update(paymentId, {
      status: PaymentStatus.SUCCESS,
    });
  }

  /**
   * Mark payment failed.
   */
  async markFailed(paymentId: string): Promise<void> {
    await this.paymentRepo.update(paymentId, {
      status: PaymentStatus.FAILED,
    });
  }

  /**
   * Read-only helpers
   */
  async findById(paymentId: string): Promise<Payment | null> {
    return this.paymentRepo.findOne({
      where: { id: paymentId },
    });
  }

  async findUnsettledSuccessPayments(tenantId: string): Promise<Payment[]> {
    return this.paymentRepo.find({
      where: {
        tenantId,
        status: PaymentStatus.SUCCESS,
      },
    });
  }
}
