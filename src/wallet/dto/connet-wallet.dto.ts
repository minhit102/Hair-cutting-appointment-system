import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ConnectWalletDto {
  @IsString()
  @IsNotEmpty({ message: 'Address is required' })
  address: string;
}
