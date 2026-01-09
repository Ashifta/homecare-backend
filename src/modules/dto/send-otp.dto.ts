import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class SendOtpDto {
  phoneNumber!: string;
}