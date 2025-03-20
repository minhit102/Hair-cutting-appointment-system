import { IsString, IsNotEmpty } from 'class-validator';

export class GetMessageDto {
  @IsString()
  @IsNotEmpty()
  senderId: string;

  @IsString()
  @IsNotEmpty()
  receiverId: string;
}
