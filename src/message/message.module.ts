import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import { Message, MessageSchema } from 'src/schemas/message.schema';
import { MessageService } from './message.service';
import { MessageGateWay } from './message.gateway';
import { MessageController } from './message.controller';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Message.name,
        schema: MessageSchema,
      },
    ]),
  ],
  controllers: [MessageController],
  providers: [MessageService, MessageGateWay],
  exports: [],
})
export class MessageModule {}
