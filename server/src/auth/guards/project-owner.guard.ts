import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class ProjectOwnerGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const projectId = request.params.projectId || request.params.id;

    if (!projectId) return true;
    if (user.role === UserRole.ADMIN) return true;

    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: { clientId: true },
    });

    if (!project || project.clientId !== user.id) {
      throw new ForbiddenException('이 프로젝트에 접근할 수 없습니다');
    }

    return true;
  }
}
