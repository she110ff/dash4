import { Controller, Get, Post, Patch, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import type { Request } from 'express';
import { ProjectService } from './project.service';
import { CreateProjectDto, UpdateStatusDto } from './dto/project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { ProjectOwnerGuard } from '../auth/guards/project-owner.guard';
import { UserRole } from '@prisma/client';

@ApiTags('projects')
@ApiBearerAuth()
@Controller('api/projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Get()
  @ApiOperation({ summary: '프로젝트 목록' })
  findAll(@Req() req: Request) {
    const user = req.user as any;
    return this.projectService.findAll(user.id, user.role);
  }

  @Get(':id')
  @UseGuards(ProjectOwnerGuard)
  @ApiOperation({ summary: '프로젝트 상세' })
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: '프로젝트 생성 (관리자)' })
  create(@Body() dto: CreateProjectDto) {
    return this.projectService.create(dto);
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: '프로젝트 상태 변경 (관리자)' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.projectService.updateStatus(id, dto.status);
  }
}
