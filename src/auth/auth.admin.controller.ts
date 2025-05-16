import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { SignInDto } from './dto/sign-in.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CreateAdminDto } from './dto/createAdmin.dto';
import { AuthAdminService } from './auth.admin.service';
@Controller('admin/auth')
export class AuthAdminController {
  constructor(private authAdminService: AuthAdminService) {}

  @Post('login')
  async signIn(@Body() signInDto: SignInDto) {
    return this.authAdminService.login(signInDto);
  }

  @Post('create-admin')
  register(@Body() createAdmin: CreateAdminDto) {
    return this.authAdminService.register(createAdmin);
  }

  @Post('forgot-password')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authAdminService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authAdminService.resetPassword(resetPasswordDto);
  }
}
