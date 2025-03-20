import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';

@WebSocketGateway(4001, {
  cors: {
    origin: '*',
  },
})
export class MessageGateWay
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  private users: Map<string, string> = new Map();

  constructor(private readonly messageService: MessageService) {}

  afterInit(server: Server) {
    console.log('WebSocket init', server);
  }

  handleConnection(socket: Socket) {
    const userId = socket.handshake.query.userId as string;
    console.log(`${userId} connected with socket ID: ${socket.id}`);
    this.users.set(userId, socket.id);
  }

  handleDisconnect(socket: Socket) {
    const userId = [...this.users.entries()].find(
      ([key, value]) => value === socket.id,
    )?.[0];
    if (userId) {
      this.users.delete(userId);
      console.log(`${userId} disconnected minh`);
    }
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(createMessageDto: CreateMessageDto) {
    const { senderId, receiverId, message } = createMessageDto;
    const savedMessage = await this.messageService.saveMessage({
      senderId,
      receiverId,
      message,
    });
    const receiverSocketId = this.users.get(receiverId);
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('receive_message', savedMessage);
    }
    return savedMessage;
  }
}
