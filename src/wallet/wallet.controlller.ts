import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { Roles } from 'src/common/roles.decorator';
import { Role } from 'src/common/enum/role.enum';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/strategies/roles.guard';
import { ConnectWalletDto } from './dto/connet-wallet.dto';
import { VerifyWalletDto } from './dto/verify-sign.dto';
import { ResponseDto } from 'src/common/dto/response.dto';
import { HttpMessage } from 'src/common/constants/http-message.enum';
@Controller('wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Customer)
  @Post('connect')
  async connectWallet(
    @Request() req,
    @Body() connectWalletDto: ConnectWalletDto,
  ): Promise<ResponseDto<any>> {
    const response = await this.walletService.connectWallet(
      req.user.id,
      connectWalletDto,
    );
    return new ResponseDto(HttpStatus.OK, HttpMessage.OK, response);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Customer)
  @Post('verify-signature')
  async verifyWallet(
    @Request() req,
    @Body() verifyWalletDto: VerifyWalletDto,
  ): Promise<ResponseDto<any>> {
    const response = await this.walletService.verifyWallet(
      req.user.id,
      verifyWalletDto,
    );
    return new ResponseDto(HttpStatus.OK, HttpMessage.OK, response);
  }

  @Post('req-connect')
  async reqVerifyWallet() {
    const response = await this.walletService.getSignatureData();
    return new ResponseDto(HttpStatus.OK, HttpMessage.OK, response);
  }
}
