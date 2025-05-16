import { IsString, IsEmail, IsOptional, IsBoolean } from 'class-validator';
import { Types } from 'mongoose';

export class CreateAdminDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  password: string;

  @IsOptional()
  branchId?: Types.ObjectId | string;
}
