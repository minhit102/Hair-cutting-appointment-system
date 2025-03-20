import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionPayload } from './dto/create-payload-transaction.dto';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import { ResponseDto } from 'src/common/dto/response.dto';
import { HttpMessage } from 'src/common/constants/http-message.enum';
@Controller('transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}
  @UseGuards(JwtAuthGuard)
  @Post('create-payload')
  async transaction(
    @Body()
    createPayloadTransactionDtoDto: CreateTransactionPayload,
    @Request() req,
  ): Promise<ResponseDto<any>> {
    console.log(req.user.walletAddress);
    const response = await this.transactionService.createTransactionPayload(
      req.user.walletAddress,
      createPayloadTransactionDtoDto,
    );
    return new ResponseDto(HttpStatus.OK, HttpMessage.OK, {
      transaction: response,
    });
  }
}
