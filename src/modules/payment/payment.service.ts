import { Injectable, BadRequestException } from '@nestjs/common';
import { Payment, PaymentMethod, PaymentStatus } from './entities/payment.entity';
import { PaymentRepository } from './payment.repository';

@Injectable()
export class PaymentService {
  constructor(
    private readonly paymentRepo: PaymentRepository,
  ) {}

  /**
   * Create a payment intent.
   * This does NOT move money.
   */
  async initiatePayment(payload: {
    appointmentId: string;
    payerWalletId: string;
    payeeWalletId: string;
    amount: string;
    method: PaymentMethod;
  }): Promise<Payment> {
    const existing = await this.paymentRepo.findOne({
      where: {
        appointmentId: payload.appointmentId,
      },
    });

    if (existing) {
      throw new BadRequestException(
        'Payment already exists for this appointment',
      );
    }

    const payment = this.paymentRepo.createForTenant({
      appointmentId: payload.appointmentId,
      payerWalletId: payload.payerWalletId,
      payeeWalletId: payload.payeeWalletId,
      amount: payload.amount,
      method: payload.method,
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
   * Read-only helpers (tenant enforced automatically)
   */
  async findById(paymentId: string): Promise<Payment | null> {
    return this.paymentRepo.findOne({
      where: { id: paymentId },
    });
  }

  async findUnsettledSuccessPayments(): Promise<Payment[]> {
    return this.paymentRepo.find({
      where: {
        status: PaymentStatus.SUCCESS,
      },
    });
  }
}
