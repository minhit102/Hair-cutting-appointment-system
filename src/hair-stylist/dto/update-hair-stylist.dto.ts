import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsEmail,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { HairStylistStatus } from 'src/schemas/hair-stylist.schemas';
export class UpdateHairStylistDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsNumber()
  @IsOptional()
  salaryBase?: number;

  @IsEnum(HairStylistStatus)
  @IsOptional()
  status?: HairStylistStatus;
}
