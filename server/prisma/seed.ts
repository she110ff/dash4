import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminHash = await bcrypt.hash('admin1234', 12);
  const clientHash = await bcrypt.hash('client1234', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@dash4.kr' },
    update: {},
    create: {
      email: 'admin@dash4.kr',
      name: '아키텍트',
      passwordHash: adminHash,
      role: 'ADMIN',
      mustChangePassword: false,
    },
  });

  const client = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: '데모 고객',
      passwordHash: clientHash,
      role: 'CLIENT',
      mustChangePassword: true,
    },
  });

  const project = await prisma.project.upsert({
    where: { id: 'demo-project-1' },
    update: {},
    create: {
      id: 'demo-project-1',
      name: 'FoodTech MVP',
      clientId: client.id,
      status: 'W2',
      githubRepoUrl: 'https://github.com/she110ff/dash4',
    },
  });

  console.log('Seed complete:', { admin: admin.email, client: client.email, project: project.name });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
