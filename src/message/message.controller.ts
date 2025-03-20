import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageGateWay } from './message.gateway';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('message')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly messageGateway: MessageGateWay,
  ) {}

  @Get('history/:senderId/:receiverId')
  async getMessageHistory(
    @Param('senderId') senderId: string,
    @Param('receiverId') receiverId: string,
  ) {
    return this.messageService.getMessageHistory(senderId, receiverId);
  }

  @Post('send')
  async sendMessage(@Body() createMessageDto: CreateMessageDto) {
    return this.messageGateway.handleSendMessage(createMessageDto);
  }
}
