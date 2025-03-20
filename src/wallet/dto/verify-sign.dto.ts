import { IsHexadecimal, IsNotEmpty, IsString } from 'class-validator';

export class VerifyWalletDto {
  @IsString()
  @IsNotEmpty({ message: 'Address is required' })
  address: string;

  @IsString()
  @IsNotEmpty({ message: 'Signature is required' })
  @IsHexadecimal({ message: 'Signature must be a valid hexadecimal string' })
  signature: string;

  @IsString()
  @IsNotEmpty({ message: 'Message is required' })
  message: string;
}
