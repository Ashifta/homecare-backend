
import { Injectable, Logger } from '@nestjs/common';
import { AlertService } from '../alert/alert.service';

@Injectable()
export class SlaService {
  private readonly logger = new Logger(SlaService.name);

  constructor(private readonly alertService: AlertService) {}

  async registerOutcomeSla(appointmentId: string) {
    this.logger.log('SLA_REGISTERED');
    setTimeout(async () => {
      await this.alertService.createAlert({
        type: 'SLA',
        severity: 'MEDIUM',
        referenceId: appointmentId,
        message: 'Outcome not submitted within SLA',
      });
    }, 30 * 60 * 1000);
  }
}
