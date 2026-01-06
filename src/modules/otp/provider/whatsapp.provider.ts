import { Injectable } from '@nestjs/common';
import { OtpProvider } from './otp.provider';

@Injectable()
export class WhatsappOtpProvider implements OtpProvider {
  async sendOtp(phoneNumber: string, otp: string): Promise<void> {
    // TODO: WhatsApp Business API integration
  }
}
