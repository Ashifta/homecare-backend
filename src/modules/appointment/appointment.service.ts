import { Injectable, Logger, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { SlotService } from '../slot/slot.service';
import { SettlementService } from '../settlement/settlement.service';
import { randomUUID } from 'crypto';

@Injectable()
export class AppointmentService {
  private readonly logger = new Logger(AppointmentService.name);

  // In-memory store (development only)
  private appointments: any[] = [];

  constructor(
    private readonly slotService: SlotService,
    @Inject(forwardRef(() => SettlementService))
    private readonly settlementService: SettlementService,
  ) {}

  async getById(id: string) {
    return this.appointments.find(a => a.id === id);
  }

  // 1️⃣ Request appointment
  async requestAppointment(payload: any) {
    try {
      await this.slotService.lockSlot(payload.slotKey);

      const appt = {
        id: randomUUID(),
        status: 'REQUESTED',
        ...payload,
      };

      this.appointments.push(appt);
      this.logger.log(`Appointment requested ${appt.id}`);
      return appt;
    } catch (error) {
      this.logger.error('Appointment request failed', error);
      throw error;
    }
  }

  // 2️⃣ Approve appointment
async approveAppointment(id: string) {
  const appt = this.appointments.find(a => a.id === id);
  if (!appt) throw new NotFoundException('Appointment not found');

  appt.status = 'APPROVED';
  this.logger.log(`Appointment approved ${id}`);
  return appt;
}

  // 3️⃣ Cancel appointment
  async cancelAppointment(id: string, reason: string) {
    const appt = this.appointments.find(a => a.id === id);
    if (!appt) throw new NotFoundException('Appointment not found');

    appt.status = 'CANCELLED';
    appt.cancelReason = reason;

    if (appt.slotKey) {
      await this.slotService.unlockSlot(appt.slotKey);
    }

    this.logger.log(`Appointment cancelled ${id}`);
    return appt;
  }

  // 4️⃣ Select FundSource (CENTRAL / FINANCE guarded in controller)
  async selectFundSource(appointmentId: string, fundSourceId: string) {
    const appt = this.appointments.find(a => a.id === appointmentId);
    if (!appt) throw new NotFoundException('Appointment not found');

    appt.fundSourceId = fundSourceId;
    this.logger.log(`FundSource selected for appointment ${appointmentId}`);
    return appt;
  }

  // 5️⃣ Settle after completion
  async settleAfterCompletion(appointmentId: string) {
    const appt = this.appointments.find(a => a.id === appointmentId);
    if (!appt) throw new NotFoundException('Appointment not found');

    return this.settlementService.settle(
      appt.tenantId,
      appt.fundSourceId,
      appt.providerWalletId,
      appt.platformWalletId,
      appt.amount,
      appt.commission,
    );
  }
}
