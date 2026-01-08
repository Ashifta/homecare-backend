
import { IsUUID } from 'class-validator';

export class SelectFundSourceDto {
  @IsUUID()
  fundSourceId!: string;
}
