import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportService {
  constructor(private prisma: PrismaService) {}

  async findByProject(projectId: string) {
    return this.prisma.weeklyReport.findMany({
      where: { projectId },
      orderBy: { weekNumber: 'asc' },
    });
  }

  async create(data: { projectId: string; weekNumber: number; completedItems: string[]; nextWeekPlan: string[] }) {
    // 같은 주차 중복 방지
    const existing = await this.prisma.weeklyReport.findUnique({
      where: { projectId_weekNumber: { projectId: data.projectId, weekNumber: data.weekNumber } },
    });
    if (existing) {
      throw new ConflictException(`Week ${data.weekNumber} 리포트가 이미 존재합니다`);
    }

    // 트랜잭션: 리포트 생성 + 인보이스 자동 생성
    const [report] = await this.prisma.$transaction([
      this.prisma.weeklyReport.create({ data }),
      this.prisma.invoice.create({
        data: {
          projectId: data.projectId,
          weekNumber: data.weekNumber,
          amount: 2500000,
        },
      }),
    ]);

    return report;
  }
}
