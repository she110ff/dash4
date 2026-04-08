import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async getMessages(projectId: string, cursor?: string, take = 30) {
    return this.prisma.chatMessage.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
      take,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      include: {
        sender: { select: { id: true, name: true, role: true } },
      },
    });
  }

  async createMessage(data: {
    projectId: string;
    senderId: string;
    senderRole: UserRole;
    content: string;
  }) {
    return this.prisma.chatMessage.create({
      data,
      include: {
        sender: { select: { id: true, name: true, role: true } },
      },
    });
  }
}
