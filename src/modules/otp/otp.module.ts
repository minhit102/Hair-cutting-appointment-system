import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { MailService } from 'src/mail/mail.service';
@Module({
  imports: [MailService],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
