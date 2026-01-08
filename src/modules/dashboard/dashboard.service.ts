
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  async centralDashboard(tenantId: string) {
    try {
      return {
        operations: {
          todayAppointments: 0,
          completedSessions: 0,
          cancellations: 0,
        },
        finance: {
          todayRevenue: 0,
          totalOutstanding: 0,
        },
        alerts: {
          unreviewed: 0,
        },
      };
    } catch (e) {
      this.logger.error('centralDashboard failed', e);
      throw e;
    }
  }
}
