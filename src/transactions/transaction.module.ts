import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
@Module({
  imports: [
    MongooseModule.forFeature([
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
