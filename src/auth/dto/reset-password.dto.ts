import { IsString, IsNotEmpty, Validate, IsEmail } from 'class-validator';
import { IsPasswordMatching } from 'src/common/validator/comparePassword';

export class ResetPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  otp: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
