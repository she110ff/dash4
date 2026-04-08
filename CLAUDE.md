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

(to be defined as build progresses)

## Commands

(to be defined)

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
