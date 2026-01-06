import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class SendOtpDto {
  @IsString()
  @IsNotEmpty()
  phoneNumber!: string;

  @IsEnum(['SMS', 'WHATSAPP'])
  channel!: 'SMS' | 'WHATSAPP';
}
