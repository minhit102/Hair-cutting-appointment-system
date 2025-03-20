import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from 'src/schemas/message.schema';
import { CreateMessageDto } from './dto/create-message.dto';
import { ResponseDto } from 'src/common/dto/response.dto';
import { HttpStatus } from 'src/common/constants/http-status.enum';
import { HttpMessage } from 'src/common/constants/http-message.enum';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}
  async saveMessage(createMessageDto: CreateMessageDto) {
    const newMessage = new this.messageModel(createMessageDto);
    return newMessage.save();
  }

  async getMessageHistory(
    senderId: string,
    receiverId: string,
  ): Promise<ResponseDto<any>> {
    const listMessage = await this.messageModel
      .find({
        $or: [
          {
            senderId: senderId,
            receiverId: receiverId,
          },
          {
            senderId: receiverId,
            receiverId: senderId,
          },
        ],
      })
      .sort({ timestamp: 1 });
    return new ResponseDto(HttpStatus.OK, HttpMessage.OK, listMessage);
  }
}
