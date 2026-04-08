import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/report.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { ProjectOwnerGuard } from '../auth/guards/project-owner.guard';
import { UserRole } from '@prisma/client';

@ApiTags('reports')
@ApiBearerAuth()
@Controller('api/projects/:id/reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportController {
  constructor(private reportService: ReportService) {}

  @Get()
  @UseGuards(ProjectOwnerGuard)
  @ApiOperation({ summary: '주간 리포트 목록' })
  findAll(@Param('id') projectId: string) {
    return this.reportService.findByProject(projectId);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: '주간 리포트 작성 (인보이스 자동 생성)' })
  create(@Param('id') projectId: string, @Body() dto: CreateReportDto) {
    return this.reportService.create({ projectId, ...dto });
  }
}
