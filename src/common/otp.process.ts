import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { OTP_QUEUE, SENT_OTP } from 'src/common/constants/queue.constant';
import { OtpService } from 'src/modules/otp/otp.service';

@Processor(OTP_QUEUE)
export class OtpProcessor {
  constructor(private otpService: OtpService) {}
  @Process(SENT_OTP)
  async sendOtp(job: Job) {
    const { email, otp } = job.data;
    await this.otpService.sendOtpToUser(email, otp);
  }
}
