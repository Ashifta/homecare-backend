
import { Injectable, NotFoundException, BadRequestException ,  Inject, forwardRef } from '@nestjs/common';
import { FundSourceService } from '../fund-source/fund-source.service';
import { LedgerService } from '../ledger/ledger.service';
import { AppointmentService } from '../appointment/appointment.service';

@Injectable()
export class SettlementService {
  constructor(
    private readonly fundSourceService: FundSourceService,
    private readonly ledgerService: LedgerService,
    @Inject(forwardRef(() => AppointmentService))
    private readonly appointmentService: AppointmentService,
  ) {}

    // 🔹 Batch / single entry point
  async settlePayment(paymentId: string) {
    // paymentId === appointmentId
    const appointment = await this.appointmentService.getById(paymentId);
    if (!appointment) {
      throw new NotFoundException('Appointment not found for settlement');
    }

    if (appointment.status !== 'COMPLETED') {
      throw new BadRequestException('Appointment not completed');
    }

    return this.settle(
      appointment.tenantId,
      appointment.fundSourceId,
      appointment.providerWalletId,
      appointment.platformWalletId,
      appointment.amount,
      appointment.commission,
    );
  }


  async settle(tenantId: string, fundSourceId: string, providerWalletId: string, platformWalletId: string, amount: number, commission: number) {
    const fs = await this.fundSourceService.getById(fundSourceId);
    if (!fs) throw new Error('FundSource not found');

    
// 🔹 Ledger entries
await this.ledgerService.record({
  tenantId,
  debitWalletId: fs.walletId,
  creditWalletId: providerWalletId,
  amount: amount - commission,
  referenceType: 'SETTLEMENT_PROVIDER',
  referenceId: fundSourceId,
});

await this.ledgerService.record({
  tenantId,
  debitWalletId: fs.walletId,
  creditWalletId: platformWalletId,
  amount: commission,
  referenceType: 'SETTLEMENT_PLATFORM',
  referenceId: fundSourceId,
});

return {

      debitWalletId: fs.walletId,
      creditProviderWalletId: providerWalletId,
      creditPlatformWalletId: platformWalletId,
      amount,
      commission,
    };
  }
}
