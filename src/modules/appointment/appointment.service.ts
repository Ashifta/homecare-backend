
import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { SlotService } from '../slot/slot.service';
import { randomUUID } from 'crypto';


@Injectable()
export class AppointmentService {
  private readonly logger = new Logger(AppointmentService.name);
  private appointments: any[] = [];

  constructor(private readonly slotService: SlotService) {}

  async requestAppointment(payload: any) {
    try {
      const slotKey = payload.slotKey;
      await this.slotService.lockSlot(slotKey);

      const appt = {
        id: Date.now().toString(),

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

  async approveAppointment(id: string, role: string) {
    try {
      if (role !== 'CENTRAL') throw new ForbiddenException();
      const appt = this.appointments.find(a => a.id === id);
      if (!appt) throw new Error('Appointment not found');
      appt.status = 'APPROVED';
      this.logger.log(`Appointment approved ${id}`);
      return appt;
    } catch (error) {
      this.logger.error('Appointment approval failed', error);
      throw error;
    }
  }

  async cancelAppointment(id: string, reason: string) {
    try {
      const appt = this.appointments.find(a => a.id === id);
      if (!appt) throw new Error('Appointment not found');
      appt.status = 'CANCELLED';
      appt.cancelReason = reason;
      await this.slotService.unlockSlot(appt.slotKey);
      this.logger.log(`Appointment cancelled ${id}`);
      return appt;
    } catch (error) {
      this.logger.error('Appointment cancel failed', error);
      throw error;
    }
  }
}
