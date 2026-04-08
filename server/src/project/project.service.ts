import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, role: UserRole) {
    const where = role === UserRole.ADMIN ? {} : { clientId: userId };
    return this.prisma.project.findMany({
      where,
      include: {
        client: { select: { id: true, name: true, email: true } },
        _count: { select: { commits: true, messages: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        client: { select: { id: true, name: true, email: true } },
        reports: { orderBy: { weekNumber: 'asc' } },
        invoices: { orderBy: { weekNumber: 'asc' } },
        _count: { select: { commits: true, messages: true } },
      },
    });
    if (!project) throw new NotFoundException('프로젝트를 찾을 수 없습니다');
    return project;
  }

  async create(data: { name: string; clientId: string; githubRepoUrl?: string }) {
    return this.prisma.project.create({ data });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.project.update({
      where: { id },
      data: { status: status as any },
    });
  }
}
