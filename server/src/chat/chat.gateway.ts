import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';

@WebSocketGateway({
  cors: { origin: '*', credentials: true },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private chatService: ChatService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.cookie
          ?.split(';')
          .find((c: string) => c.trim().startsWith('access_token='))
          ?.split('=')[1];

      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: { id: true, name: true, role: true },
      });

      if (!user) {
        client.disconnect();
        return;
      }

      (client as any).user = user;
      this.logger.log(`Connected: ${user.name} (${user.role})`);
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const user = (client as any).user;
    if (user) {
      this.logger.log(`Disconnected: ${user.name}`);
    }
  }

  @SubscribeMessage('join')
  async handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { projectId: string },
  ) {
    const user = (client as any).user;
    if (!user) return;

    // IDOR 방지: client는 본인 프로젝트만
    if (user.role === UserRole.CLIENT) {
      const project = await this.prisma.project.findUnique({
        where: { id: data.projectId },
        select: { clientId: true },
      });
      if (!project || project.clientId !== user.id) return;
    }

    client.join(data.projectId);
    this.logger.log(`${user.name} joined room ${data.projectId}`);
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { projectId: string; content: string },
  ) {
    const user = (client as any).user;
    if (!user || !data.content?.trim()) return;

    const message = await this.chatService.createMessage({
      projectId: data.projectId,
      senderId: user.id,
      senderRole: user.role,
      content: data.content.trim(),
    });

    this.server.to(data.projectId).emit('message', message);
  }
}
