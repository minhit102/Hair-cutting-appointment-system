import { BadRequestException, Injectable } from '@nestjs/common';
import Web3 from 'web3';
import { CreateTransactionPayload } from './dto/create-payload-transaction.dto';

@Injectable()
export class TransactionService {
  private web3: Web3;

  constructor() {
    const infuraUrl = process.env.INFURA_URL;
    this.web3 = new Web3(infuraUrl);
  }
  async createTransactionPayload(
    fromAddress: string,
    createPayloadTransactionDtoDto: CreateTransactionPayload,
  ) {
    const { recipientAddress, value } = createPayloadTransactionDtoDto;
    if (!this.web3.utils.isAddress(fromAddress)) {
      throw new BadRequestException('Invalid Ethereum fromAddress');
    }
    if (!this.web3.utils.isAddress(recipientAddress)) {
      throw new BadRequestException('Invalid Ethereum recipientAddress');
    }
    if (isNaN(parseFloat(value)) || parseFloat(value) <= 0) {
      throw new BadRequestException('Transaction value must be greater than 0');
    }
    const nonce = await this.web3.eth.getTransactionCount(
      fromAddress,
      'latest',
    );
    const gasPrice = await this.web3.eth.getGasPrice();
    const gasLimit = 21000;
    const txPayload = {
      from: fromAddress,
      to: recipientAddress,
      value: this.web3.utils.toHex(this.web3.utils.toWei(value, 'ether')),
      gas: this.web3.utils.toHex(gasLimit),
      gasPrice: this.web3.utils.toHex(gasPrice),
      nonce: this.web3.utils.toHex(nonce),
    };
    return txPayload;
  }

  async broadcastTransaction(rawTransaction: string) {
    try {
      const receipt = await this.web3.eth.sendSignedTransaction(rawTransaction);
      return receipt;
    } catch (error) {
      throw new Error(`Error broadcasting transaction: ${error.message}`);
    }
  }
}
