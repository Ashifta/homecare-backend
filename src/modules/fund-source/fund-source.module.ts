
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FundSource } from './fund-source.entity';
import { FundSourceService } from './fund-source.service';

@Module({
  imports: [TypeOrmModule.forFeature([FundSource])],
  providers: [FundSourceService],
  exports: [FundSourceService, TypeOrmModule],
})
export class FundSourceModule {}
