# Dash4

AI 기반 투명 후불제 4주 MVP 제작 서비스 플랫폼.

## Tech Stack

- Frontend: Vite + React + TypeScript
- Backend: NestJS + Prisma + PostgreSQL
- Auth: 자체 JWT (Passport.js + bcrypt + httpOnly cookie + refresh token)
- API Docs: Swagger (@nestjs/swagger, /api-docs 엔드포인트)
- Realtime: Socket.IO (NestJS backend on ECS Fargate)
- Deploy: AWS (S3 + CloudFront + ECS Fargate + RDS PostgreSQL + Route53)
- CI/CD: GitHub Actions

## Project Structure

```
dash4/
├── client/          # Vite + React + TypeScript (프론트엔드)
├── server/          # NestJS + Prisma + PostgreSQL (백엔드)
│   ├── prisma/      # Prisma schema
│   ├── generated/   # Prisma client (gitignored)
│   └── src/         # NestJS modules
├── DESIGN.md        # 디자인 시스템
├── CASE_STUDY.md    # 케이스 스터디 #1 기록
└── CLAUDE.md        # 이 파일
```

## Ports

| Service | Port |
|---------|------|
| Server (NestJS) | 7111 |
| Client (Vite) | 7112 |
| DB (PostgreSQL) | 7113 (외부) → 5432 (컨테이너 내부) |

## Commands

```bash
docker compose up -d  # PostgreSQL 컨테이너 시작
pnpm run dev          # client + server 동시 실행
pnpm run dev:server   # 백엔드만 (localhost:7111)
pnpm run dev:client   # 프론트만 (localhost:7112)
pnpm run test:server  # 서버 테스트 (Jest)
pnpm run test:client  # 클라이언트 테스트 (Vitest)
cd server && npx prisma migrate dev   # DB 마이그레이션
cd server && npx prisma generate      # Prisma 클라이언트 재생성
```

## Design System
Always read DESIGN.md before making any visual or UI decisions.
All font choices, colors, spacing, and aesthetic direction are defined there.
Do not deviate without explicit user approval.
In QA mode, flag any code that doesn't match DESIGN.md.

## Design Doc

~/.gstack/projects/dash4/youngsoo.jung-unknown-design-20260409-031313.md

## Skill routing

When the user's request matches an available skill, ALWAYS invoke it using the Skill
tool as your FIRST action. Do NOT answer directly, do NOT use other tools first.
The skill has specialized workflows that produce better results than ad-hoc answers.

Key routing rules:
- Product ideas, "is this worth building", brainstorming → invoke office-hours
- Bugs, errors, "why is this broken", 500 errors → invoke investigate
- Ship, deploy, push, create PR → invoke ship
- QA, test the site, find bugs → invoke qa
- Code review, check my diff → invoke review
- Update docs after shipping → invoke document-release
- Weekly retro → invoke retro
- Design system, brand → invoke design-consultation
- Visual audit, design polish → invoke design-review
- Architecture review → invoke plan-eng-review
- Save progress, checkpoint, resume → invoke checkpoint
- Code quality, health check → invoke health
