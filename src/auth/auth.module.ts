import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/common/strategies/jwt.strategy';
import { Otp, OtpSchema } from '../schemas/otp.schema';
import { BullModule } from '@nestjs/bull';
import { OtpProcessor } from 'src/common/otp.process';
import { MailModule } from 'src/mail/mail.module';
import { PasswordService } from '../common/password.service';
import { OTP_QUEUE } from 'src/common/constants/queue.constant';
import { OtpService } from 'src/otp/otp.service';
import { Admin, AdminSchema } from 'src/schemas/admin.schema';
import { Branch, BranchSchema } from 'src/schemas/branchs.schema';
import { AuthAdminController } from './auth.admin.controller';
import { AuthAdminService } from './auth.admin.service';
@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
      },
    }),
    BullModule.registerQueue({
      name: OTP_QUEUE,
    }),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Otp.name,
        schema: OtpSchema,
      },
      {
        name: Admin.name,
        schema: AdminSchema,
      },
      {
        name: Branch.name,
        schema: BranchSchema,
      },
    ]),
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: process.env.EXPERIRES_IN },
      }),
    }),
    PassportModule,
    MailModule,
  ],
  providers: [
    AuthService,
    JwtStrategy,
    OtpService,
    OtpProcessor,
    PasswordService,
    AuthAdminService,
  ],
  controllers: [AuthController, AuthAdminController],
  exports: [AuthService, JwtModule, AuthAdminService],
})
export class AuthModule {}
