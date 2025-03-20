import { IsHexadecimal, IsNotEmpty, IsString } from 'class-validator';

export class VerifySignatureDto {
  @IsString()
  @IsNotEmpty({ message: 'Address is required' })
  walletAddress: string;

  @IsString()
  @IsNotEmpty({ message: 'Signature is required' })
  @IsHexadecimal({ message: 'Signature must be a valid hexadecimal string' })
  signature: string;
}
