// create-hair-stylist.dto.ts

import { IsString, IsOptional, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateHairStylistDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  imgAvt?: string;

  @IsString()
  @IsOptional()
  imgBackground?: string;

  @IsOptional()
  salaryBase?: number;

  @IsString()
  @IsOptional()
  branchId?: string;
}
