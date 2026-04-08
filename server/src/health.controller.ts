import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('health')
@Controller('api')
export class HealthController {
  @Get('health')
  @ApiOperation({ summary: '헬스 체크' })
  health() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
