
import { Controller, Post, Body, Param, Headers } from '@nestjs/common';
import { OutcomeService } from './outcome.service';

@Controller('outcomes')
export class OutcomeController {
  constructor(private readonly outcomeService: OutcomeService) {}

  @Post()
  submit(@Body() body: any) {
    return this.outcomeService.submitOutcome(body);
  }

  @Post(':id/review')
  review(@Param('id') id: string, @Headers('role') role: string) {
    return this.outcomeService.reviewOutcome(id, role);
  }
}
