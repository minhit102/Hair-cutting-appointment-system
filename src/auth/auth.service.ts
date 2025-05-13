import { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import * as bcrypt from 'bcrypt';

import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from 'src/schemas/user.schema';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { OtpService } from 'src/otp/otp.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { SignInDto } from './dto/sign-in.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Otp, OtpDocument } from 'src/schemas/otp.schema';
import { PasswordService } from '../common/password.service';
import { ResponseDto } from 'src/common/dto/response.dto';
import { HttpMessage } from 'src/common/constants/http-message.enum';
import { HttpStatus } from 'src/common/constants/http-status.enum';
import { LoginRequestDto } from './dto/login-request.dto';
import { VerifySignatureDto } from './dto/verify-signature.dto';
import { Redis } from 'ioredis';
import { randomBytes } from 'crypto';
import Web3 from 'web3';
import { ApiError } from 'src/common/errors/api.error';

@Injectable()
export class AuthService {
  private redisClient: Redis;
  private web3: Web3;
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Otp.name) private otpModel: Model<OtpDocument>,
    private otpService: OtpService,
    private passwordService: PasswordService,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<any> {
    const { email, password, username } = registerUserDto;
    const existUser = await this.userModel.findOne({
      email: email,
    });
    if (existUser) {
      throw new ApiError('E100', 'User already exists');
    }
    const hashPassword = await this.passwordService.hashPassword(password);

    const newUser = await this.userModel.create({
      username: username,
      email: email,
      password: hashPassword,
    });
    return new ResponseDto(HttpStatus.OK, HttpMessage.OK);
  }

  async login(signInDto: SignInDto) {
    const user = await this.userModel.findOne({ email: signInDto.email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isMatch = await this.passwordService.comparePassword(
      signInDto.password,
      user.password,
    );
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };
    const data = {
      id: user._id,
      email: user.email,
      role: user.role,
      accessToken: this.jwtService.sign(payload),
      username: user.username,
      imgAvt: user.imgAvt,
    };
    return new ResponseDto(HttpStatus.OK, HttpMessage.OK, data);
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<ResponseDto<any>> {
    const findUser = await this.userModel.findOne({
      email: forgotPasswordDto.email,
    });

    if (!findUser) {
      throw new BadRequestException(
        `User with ${forgotPasswordDto.email} not exits`,
      );
    }
    const otp = await this.otpService.generateAndSaveOTP(findUser.email);
    await this.otpService.sendOtp(findUser.email, otp);
    return new ResponseDto(HttpStatus.OK, HttpMessage.OK);
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<ResponseDto<any>> {
    const findUser = await this.otpModel.findOne({
      email: resetPasswordDto.email,
    });
    if (!findUser) {
      throw new BadRequestException('No OTP found for this email');
    }
    if (findUser.otp !== resetPasswordDto.otp) {
      throw new BadRequestException('Invalid OTP');
    }
    const now = new Date();
    if (now > findUser.expiresAt) {
      throw new BadRequestException('OTP has expired');
    }
    const hashPassword = await this.passwordService.hashPassword(
      resetPasswordDto.password,
    );
    const user = await this.userModel.findOneAndUpdate(
      { email: resetPasswordDto.email },
      { password: hashPassword },
    );
    if (!user) {
      throw new BadRequestException('User not found');
    }
    await this.otpModel.deleteOne({ email: resetPasswordDto.email });
    return new ResponseDto(HttpStatus.OK, HttpMessage.OK);
  }
  async generateNonce(loginRequestDto: LoginRequestDto) {
    const { walletAddress } = loginRequestDto;
    const nonce = randomBytes(16).toString('hex');
    await this.redisClient.set(`nonce:${walletAddress}`, nonce, 'EX', 300);
    const message = `Authentivate with nonce : ${nonce}`;
    console.log(message);

    return { nonce: nonce, message: message };
  }
  async verifySignature(verifySignatureDto: VerifySignatureDto) {
    const { walletAddress, signature } = verifySignatureDto;
    const nonce = await this.redisClient.get(`nonce:${walletAddress}`);
    if (!nonce) {
      throw new BadRequestException(
        'Nonce does not exist. Please request a new nonce.',
      );
    }
    const message = `Authentivate with nonce : ${nonce}`;

    const signerAddress = this.web3.eth.accounts.recover(message, signature);
    console.log('hello', signerAddress, '---', walletAddress);
    if (signerAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      throw new BadRequestException('Signature does not match.');
    }
    this.redisClient.del(`nonce:${walletAddress}`);
    const payload = { walletAddress };
    const token = this.jwtService.sign(payload);
    return { accessToken: token };
  }
}
