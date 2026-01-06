import { Injectable } from '@nestjs/common';
import { OtpProvider } from './otp.provider';

@Injectable()
export class ExotelOtpProvider implements OtpProvider {
  async sendOtp(phoneNumber: string, otp: string): Promise<void> {
    // TODO: Exotel SDK integration
    // IMPORTANT: no console.log here
  }
}
