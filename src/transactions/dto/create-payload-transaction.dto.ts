import { IsString } from 'class-validator';

export class CreateTransactionPayload {
  @IsString()
  recipientAddress: string;

  @IsString()
  value: string;
}
