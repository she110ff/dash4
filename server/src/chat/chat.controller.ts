import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProjectOwnerGuard } from '../auth/guards/project-owner.guard';

@ApiTags('chat')
@Controller('api')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('projects/:id/messages')
  @UseGuards(JwtAuthGuard, ProjectOwnerGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '채팅 히스토리 (cursor pagination)' })
  @ApiQuery({ name: 'cursor', required: false })
  @ApiQuery({ name: 'take', required: false })
  getMessages(
    @Param('id') projectId: string,
    @Query('cursor') cursor?: string,
    @Query('take') take?: string,
  ) {
    return this.chatService.getMessages(projectId, cursor, take ? parseInt(take) : 30);
  }
}
