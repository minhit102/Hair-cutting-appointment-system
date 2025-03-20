import {
  IsOptional,
  IsString,
  IsEmail,
  IsDate,
  IsPhoneNumber,
} from 'class-validator';
import { Role } from 'src/common/enum/role.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsDate()
  dayOfBirth?: Date;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  role?: Role;
}
