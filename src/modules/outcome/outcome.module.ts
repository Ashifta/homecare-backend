
import { Module } from '@nestjs/common';
import { OutcomeService } from './outcome.service';
import { OutcomeController } from './outcome.controller';
import { AlertModule } from '../alert/alert.module';

@Module({
  imports: [AlertModule],
  controllers: [OutcomeController],
  providers: [OutcomeService],
})
export class OutcomeModule {}
