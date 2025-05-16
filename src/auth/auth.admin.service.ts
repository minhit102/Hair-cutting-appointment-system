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
import { Redis } from 'ioredis';
import Web3 from 'web3';
import { ApiError } from 'src/common/errors/api.error';
import { Admin, AdminDocument } from 'src/schemas/admin.schema';
import { CreateAdminDto } from './dto/createAdmin.dto';
import { Branch, BranchDocument } from 'src/schemas/branchs.schema';

@Injectable()
export class AuthAdminService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Branch.name) private branchModel: Model<BranchDocument>,
    @InjectModel(Otp.name) private otpModel: Model<OtpDocument>,
    private otpService: OtpService,
    private passwordService: PasswordService,
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
  ) {}

  async register(createAdmin: CreateAdminDto) {
    const { email, password, username, branchId } = createAdmin;
    const existUser = await this.adminModel.findOne({
      email: email,
    });
    const existBranch = await this.branchModel.findOne({
      _id: branchId,
    });
    if (existUser) {
      throw new ApiError('E100', 'User already exists');
    }
    const hashPassword = await this.passwordService.hashPassword(password);

    const newUser = await this.adminModel.create({
      username: username,
      email: email,
      password: hashPassword,
      branchId: branchId,
    });
    return new ResponseDto(HttpStatus.OK, HttpMessage.OK);
  }

  async login(signInDto: SignInDto) {
    const admin = await this.adminModel.findOne({ email: signInDto.email });
    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isMatch = await this.passwordService.comparePassword(
      signInDto.password,
      admin.password,
    );
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = {
      id: admin._id,
      email: admin.email,
    };
    const data = {
      id: admin._id,
      email: admin.email,
      accessToken: this.jwtService.sign(payload),
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
}
