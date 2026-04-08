import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommitService {
  private readonly logger = new Logger(CommitService.name);

  constructor(private prisma: PrismaService) {}

  async findByProject(projectId: string, cursor?: string, take = 20) {
    return this.prisma.commit.findMany({
      where: { projectId },
      orderBy: { timestamp: 'desc' },
      take,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    });
  }

  async handleGithubWebhook(payload: any) {
    const repoUrl = payload.repository?.html_url;
    if (!repoUrl) {
      this.logger.warn('Webhook: no repository URL');
      return { processed: 0 };
    }

    const project = await this.prisma.project.findFirst({
      where: { githubRepoUrl: repoUrl },
    });

    if (!project) {
      this.logger.warn(`Webhook: no project for repo ${repoUrl}`);
      return { processed: 0 };
    }

    const commits = payload.commits || [];
    let processed = 0;

    for (const commit of commits) {
      await this.prisma.commit.upsert({
        where: {
          projectId_sha: { projectId: project.id, sha: commit.id },
        },
        update: {},
        create: {
          projectId: project.id,
          sha: commit.id,
          message: commit.message,
          author: commit.author?.name || commit.author?.username || 'unknown',
          timestamp: new Date(commit.timestamp),
          url: commit.url,
        },
      });
      processed++;
    }

    this.logger.log(`Webhook: ${processed} commits for ${project.name}`);
    return { processed, projectId: project.id };
  }
}
