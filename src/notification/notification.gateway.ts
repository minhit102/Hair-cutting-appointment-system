import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationService } from './notification.service';
import { Role } from 'src/common/enum/role.enum';

@WebSocketGateway(4001, {
  cors: {
    origin: '*',
  },
})
export class NotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  private adminRoom = 'adminRoom';

  constructor(private readonly notificationService: NotificationService) {}

  afterInit(server: Server) {
    console.log('WebSocket initialized', server);
  }
  handleConnection(socket: Socket) {
    console.log('User connected:', socket.id);
    const role = socket.handshake.query.role;
    if (role === Role.Admin) {
      socket.join(this.adminRoom);
      console.log(`Admin ${socket.id} joined ${this.adminRoom}`);
    }
  }

  handleDisconnect(socket: Socket) {
    console.log('User disconnected:', socket.id);
    socket.leave(this.adminRoom);
    console.log(`Admin ${socket.id} left ${this.adminRoom}`);
  }

  async handleSendNotification(notification: object) {
    this.server.to(this.adminRoom).emit('newNotification', notification);
  }
}
