
import { Module } from '@nestjs/common';
import { SlaService } from './sla.service';
import { AlertModule } from '../alert/alert.module';

@Module({
  imports: [AlertModule],
  providers: [SlaService],
})
export class SlaModule {}
