import { BadRequestException, Injectable } from '@nestjs/common';
import Web3 from 'web3';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import {
  WalletBlock,
  WalletBlockDocument,
} from 'src/schemas/walletBlock.schemas';
import { ConnectWalletDto } from './dto/connet-wallet.dto';
import { User, UserDocument } from 'src/schemas/user.schema';
import { VerifyWalletDto } from './dto/verify-sign.dto';

@Injectable()
export class WalletService {
  private web3: Web3;

  constructor(
    @InjectModel(WalletBlock.name)
    private walletBlockModel: Model<WalletBlockDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {
    this.web3 = new Web3(
      'https://mainnet.infura.io/v3/88a7dff16f4a47448704e143385db081',
    );
  }
  async connectWallet(
    customerId: ObjectId,
    connectWalletDto: ConnectWalletDto,
  ) {
    if (!this.web3.utils.isAddress(connectWalletDto.address)) {
      throw new BadRequestException('Invalid wallet address');
    }
    const findWallet = await this.walletBlockModel.findOne({
      customerId: customerId,
      publicAddress: connectWalletDto.address,
    });
    if (findWallet) {
      throw new BadRequestException('User has connected address');
    }
    const newWallet = await this.walletBlockModel.create({
      customerId: customerId,
      publicAddress: connectWalletDto.address,
    });
    return newWallet;
  }

  async verifyWallet(customerId: ObjectId, verifyWalletDto: VerifyWalletDto) {
    const { address, signature, message } = verifyWalletDto;
    const findWalletConnect = await this.walletBlockModel.findOne({
      customerId,
      publicAddress: address,
    });
    if (!findWalletConnect) {
      throw new BadRequestException(
        'Wallet not found for the provided customer and address.',
      );
    }
    const recoveredAddress = this.web3.eth.accounts.recover(message, signature);
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      throw new BadRequestException(
        'Invalid signature for the provided address.',
      );
    }
    findWalletConnect.verified = true;
    await findWalletConnect.save();
    return findWalletConnect;
  }

  async getBalance(addressPublic: string) {
    const balanceWei = await this.web3.eth.getBalance(addressPublic);
    const balanceEth = this.web3.utils.fromWei(balanceWei, 'ether');
    return balanceEth;
  }

  async getSignatureData() {
    const address = '0x801e536C82B905F8a5417373B1c5EB20e51FC0F5';
    const message = 'This is a test message';
    const hexMessage = this.web3.utils.utf8ToHex(message);
    const signature = await this.web3.eth.sign(hexMessage, address);
    return {
      address: address,
      signature: signature,
      message: message,
    };
  }
}
