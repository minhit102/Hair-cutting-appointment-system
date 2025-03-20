import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  WalletBlock,
  WalletBlockSchema,
} from 'src/schemas/walletBlock.schemas';
import { User, UserSchema } from 'src/schemas/user.schema';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: WalletBlock.name,
        schema: WalletBlockSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [TransactionService],
  controllers: [TransactionController],
  exports: [],
})
export class TransactionModule {}
