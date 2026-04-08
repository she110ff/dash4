import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InvoiceStatus } from '@prisma/client';

@Injectable()
export class InvoiceService {
  constructor(private prisma: PrismaService) {}

  async findByProject(projectId: string) {
    return this.prisma.invoice.findMany({
      where: { projectId },
      orderBy: { weekNumber: 'asc' },
    });
  }

  async updateStatus(id: string, status: InvoiceStatus) {
    return this.prisma.invoice.update({
      where: { id },
      data: {
        status,
        ...(status === InvoiceStatus.PAID ? { paidAt: new Date() } : {}),
      },
    });
  }

  async findAll() {
    return this.prisma.invoice.findMany({
      include: {
        project: { select: { id: true, name: true, client: { select: { name: true } } } },
      },
      orderBy: { issuedAt: 'desc' },
    });
  }
}
