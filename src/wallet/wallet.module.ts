import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controlller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  WalletBlock,
  WalletBlockSchema,
} from 'src/schemas/walletBlock.schemas';
import { User, UserSchema } from 'src/schemas/user.schema';
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
  providers: [WalletService],
  controllers: [WalletController],
  exports: [],
})
export class WalletModule {}
