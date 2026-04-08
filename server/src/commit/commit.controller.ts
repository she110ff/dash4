import { Controller, Get, Post, Param, Query, Body, UseGuards, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CommitService } from './commit.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProjectOwnerGuard } from '../auth/guards/project-owner.guard';

@ApiTags('commits')
@Controller('api')
export class CommitController {
  constructor(private commitService: CommitService) {}

  @Get('projects/:id/commits')
  @UseGuards(JwtAuthGuard, ProjectOwnerGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '프로젝트 커밋 목록 (cursor pagination)' })
  @ApiQuery({ name: 'cursor', required: false })
  @ApiQuery({ name: 'take', required: false })
  findByProject(
    @Param('id') projectId: string,
    @Query('cursor') cursor?: string,
    @Query('take') take?: string,
  ) {
    return this.commitService.findByProject(projectId, cursor, take ? parseInt(take) : 20);
  }

  @Post('webhooks/github')
  @HttpCode(200)
  @ApiOperation({ summary: 'GitHub webhook 수신' })
  handleWebhook(@Body() payload: any) {
    return this.commitService.handleGithubWebhook(payload);
  }
}
