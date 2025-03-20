import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { SignInDto } from './dto/sign-in.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResponseDto } from 'src/common/dto/response.dto';
import { HttpMessage } from 'src/common/constants/http-message.enum';
import { LoginRequestDto } from './dto/login-request.dto';
import { VerifySignatureDto } from './dto/verify-signature.dto';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('login')
  async signIn(@Body() signInDto: SignInDto): Promise<ResponseDto<any>> {
    const response = await this.authService.signIn(signInDto);
    console.log('Loi');
    return new ResponseDto(HttpStatus.OK, HttpMessage.OK, response);
  }

  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }
  @Post('forgot-password')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Post('request-nonce')
  async requestNonce(@Body() loginRequestDto: LoginRequestDto) {
    const response = await this.authService.generateNonce(loginRequestDto);
    return new ResponseDto(HttpStatus.OK, HttpMessage.OK, response);
  }

  @Post('verify-signature')
  async verifySignature(@Body() verifySignatureDto: VerifySignatureDto) {
    return this.authService.verifySignature(verifySignatureDto);
  }
}
