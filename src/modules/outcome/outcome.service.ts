
import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { AlertService } from '../alert/alert.service';

@Injectable()
export class OutcomeService {
  private readonly logger = new Logger(OutcomeService.name);
  private outcomes: any[] = [];

  constructor(private readonly alertService: AlertService) {}

  async submitOutcome(payload: any) {
    this.logger.log('OUTCOME_SUBMITTED');
    const outcome = {
      id: Date.now().toString(),
      ...payload,
      createdAt: new Date(),
    };
    this.outcomes.push(outcome);

    if (['HIGH', 'CRITICAL'].includes(payload.severity)) {
      await this.alertService.createAlert({
        type: 'OUTCOME',
        severity: payload.severity,
        referenceId: outcome.id,
        message: 'Negative outcome reported',
      });
    }
    return outcome;
  }

  async reviewOutcome(id: string, role: string) {
    if (role !== 'CENTRAL') throw new ForbiddenException();
    const outcome = this.outcomes.find(o => o.id === id);
    if (!outcome) throw new Error('Outcome not found');
    outcome.reviewed = true;
    this.logger.log('OUTCOME_REVIEWED');
    return outcome;
  }
}
