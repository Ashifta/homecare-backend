import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FundSource } from './fund-source.entity';
import { FundSourceService } from './fund-source.service';
import { FundSourceRepository } from './fund-source.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([FundSource]),
  ],
  providers: [
    FundSourceService,
    FundSourceRepository,
  ],
  exports: [
    FundSourceService,
  ],
})
export class FundSourceModule {}
