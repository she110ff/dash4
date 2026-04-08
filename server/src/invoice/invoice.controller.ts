import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InvoiceService } from './invoice.service';
import { UpdateInvoiceDto } from './dto/invoice.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { ProjectOwnerGuard } from '../auth/guards/project-owner.guard';
import { UserRole } from '@prisma/client';

@ApiTags('invoices')
@ApiBearerAuth()
@Controller('api')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InvoiceController {
  constructor(private invoiceService: InvoiceService) {}

  @Get('projects/:id/invoices')
  @UseGuards(ProjectOwnerGuard)
  @ApiOperation({ summary: '프로젝트 인보이스 목록' })
  findByProject(@Param('id') projectId: string) {
    return this.invoiceService.findByProject(projectId);
  }

  @Get('invoices')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: '전체 인보이스 목록 (관리자)' })
  findAll() {
    return this.invoiceService.findAll();
  }

  @Patch('invoices/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: '인보이스 상태 변경 (관리자)' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateInvoiceDto) {
    return this.invoiceService.updateStatus(id, dto.status);
  }
}
