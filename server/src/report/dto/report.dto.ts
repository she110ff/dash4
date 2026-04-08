import { IsInt, IsArray, IsString, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReportDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  @Max(4)
  weekNumber: number;

  @ApiProperty({ example: ['API 엔드포인트 구현', '인증 시스템 완성'] })
  @IsArray()
  @IsString({ each: true })
  completedItems: string[];

  @ApiProperty({ example: ['프론트엔드 개발', 'UI 테스트'] })
  @IsArray()
  @IsString({ each: true })
  nextWeekPlan: string[];
}
