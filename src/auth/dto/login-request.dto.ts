import { IsNotEmpty, IsString } from 'class-validator';
export class LoginRequestDto {
  @IsString()
  @IsNotEmpty()
  walletAddress: string;
}
