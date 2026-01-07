
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AlertService {
  private readonly logger = new Logger(AlertService.name);
  private alerts: any[] = [];

  async createAlert(payload: any) {
    const alert = {
      id: Date.now().toString(),
      ...payload,
      createdAt: new Date(),
      acknowledged: false,
    };
    this.alerts.push(alert);
    this.logger.warn(`ALERT_CREATED: ${payload.severity}`);
    return alert;
  }

  listAlerts() {
    return this.alerts;
  }

  acknowledge(id: string) {
    const alert = this.alerts.find(a => a.id === id);
    if (alert) alert.acknowledged = true;
    return alert;
  }
}
