
import { Module } from '@nestjs/common';
import { CentralAssignmentService } from './central-assignment.service';

@Module({
  providers: [CentralAssignmentService],
  exports: [CentralAssignmentService],
})
export class CentralAssignmentModule {}
