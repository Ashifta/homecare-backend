import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { ExotelOtpProvider } from './provider/exotel.provider';
import { WhatsappOtpProvider } from './provider/whatsapp.provider';

@Module({
  providers: [
    OtpService,
    ExotelOtpProvider,
    WhatsappOtpProvider,
  ],
  exports: [
    OtpService, // 🔥 this is important
  ],
})
export class OtpModule {}
