import { IsString, IsOptional, IsBoolean, IsArray } from 'class-validator';

export class CreateBranchDto {
  @IsString()
  name: string;

  @IsOptional()
  address?: {
    street?: string;
    ward?: string;
    district?: string;
    city?: string;
    country?: string;
  };

  @IsOptional()
  location?: {
    type: 'Point';
    coordinates: [number, number];
  };

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
