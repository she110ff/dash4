import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './project/project.module';
import { CommitModule } from './commit/commit.module';
import { ChatModule } from './chat/chat.module';
import { HealthController } from './health.controller';

@Module({
  imports: [PrismaModule, AuthModule, ProjectModule, CommitModule, ChatModule],
  controllers: [HealthController],
})
export class AppModule {}
