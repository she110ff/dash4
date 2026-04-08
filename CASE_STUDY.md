# Case Study #1: Dash4 자체 구축

## 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 프로젝트명 | Dash4 서비스 플랫폼 |
| 유형 | SaaS 웹앱 (랜딩 + 고객 포털 + 관리자) |
| 기간 | 4주 (2026-04-09 ~) |
| 스택 | Vite+React, NestJS, Prisma, PostgreSQL, AWS |
| 개발 방식 | 27년 경력 아키텍트 + Claude Code AI 협업 |

## 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                       CloudFront (CDN)                       │
│                    S3 Static (Vite Build)                     │
│                      dash4.kr (:443)                         │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────┐
│                    ALB (Application LB)                       │
│              /api/* , /socket.io/* → ECS                     │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────┐
│              NestJS on ECS Fargate (:7111)                    │
│                                                              │
│  ┌────────┐  ┌─────────┐  ┌──────────┐  ┌───────────────┐  │
│  │  Auth   │  │ Project │  │  Commit  │  │   Chat        │  │
│  │  JWT    │  │  CRUD   │  │ Webhook  │  │  Socket.IO    │  │
│  └────────┘  └─────────┘  └──────────┘  └───────────────┘  │
│  ┌────────────┐  ┌───────────┐  ┌───────────────────────┐  │
│  │   Report   │  │  Invoice  │  │  Swagger (/api-docs)  │  │
│  └────────────┘  └───────────┘  └───────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Prisma ORM → PostgreSQL                   │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                    RDS PostgreSQL (:5432)                     │
│                                                              │
│  users · projects · commits · weekly_reports                 │
│  invoices · chat_messages                                    │
└─────────────────────────────────────────────────────────────┘
```

## 데이터 모델

```
User ──1:N──> Project ──1:N──> Commit
                  │──1:N──> WeeklyReport ──triggers──> Invoice
                  │──1:N──> ChatMessage
                  └──1:N──> Invoice
```

## 인증 플로우

```
Admin creates User (temp password)
       │
       ▼
Client login (email + password)
       │
       ├─ JWT access token → httpOnly cookie (15min)
       ├─ JWT refresh token → httpOnly cookie (7days) + bcrypt hash in DB
       └─ mustChangePassword flag → 강제 비밀번호 변경
       │
       ▼
Token refresh (rotation)
       │
       ├─ 유효한 refresh → 새 access + 새 refresh (이전 무효화)
       └─ 탈취된 이전 refresh → 전체 세션 무효화 (보안 경보)
```

## 설계 결정 기록

| 결정 | 선택 | 이유 |
|------|------|------|
| 프레임워크 | NestJS + Vite React | 클라이언트 프로젝트와 동일 스택 → "우리가 쓰는 기술로 만들었습니다" |
| 인증 | 자체 JWT (Passport.js) | 외부 의존성 최소화, 고객 데이터 완전 통제 |
| DB | PostgreSQL (Prisma 5) | 안정성 검증된 ORM + 타입 안전성 |
| 배포 | AWS (ECS Fargate + RDS) | 고객 인프라와 동일 환경 → 인프라 비용 의뢰인 직접 관리 가능 |
| IaC | AWS CDK (TypeScript) | 인프라를 코드로 관리, 재현 가능한 배포 |
| 디자인 | Satoshi + Pretendard, 다크/라이트 이중 테마 | 경쟁사(Inter/Poppins) 차별화, 한글 최적화 |
| 레이아웃 | 비대칭 좌우 교차 | AI 생성 템플릿과 차별화 (3열 그리드 금지) |
| 채팅 | Socket.IO (단일 ECS 태스크) | v1 규모(동시 4-5명)에서 충분, Redis Adapter는 v2 |

## 주간 기록

### Week 1: 랜딩 + 인증 (04/09 ~ 04/15)

**목표:**
- [x] JWT 자체 인증 (로그인/로그아웃/비밀번호 변경/refresh rotation)
- [x] DB 스키마 (6 모델) + 시드 데이터
- [x] Prisma 모델 정의
- [x] Swagger API 문서 (/api-docs)
- [x] ProjectOwnerGuard (IDOR 방지)
- [x] 히어로, 3 필라, 4주 타임라인, 케이스 스터디 섹션
- [x] AWS 인프라 선 셋업 (CDK: VPC + RDS + ECS Fargate + S3 + CloudFront)

**커밋 수:** 10
**산출물:**
- 설계 문서: 디자인 문서 (adversarial review 8/10)
- 디자인 시스템: `DESIGN.md` (Satoshi + Pretendard, #2563eb, 이중 테마)
- Swagger: `http://localhost:7111/api-docs` (6개 엔드포인트)
- 아키텍처 다이어그램: 이 파일 상단 참조
- 인프라 코드: `infra/` (AWS CDK, CloudFormation 자동 생성)
- 스크린샷: `docs/screenshots/w1-landing-v1.png`

**메모:**
- 2026-04-09: 프로젝트 시작. /office-hours → 디자인 문서 완성 (8/10 adversarial review)
- 2026-04-09: /plan-eng-review (9 issues, 8 resolved) + /plan-design-review (3/10→7/10)
- 2026-04-09: /design-consultation → DESIGN.md 생성. 경쟁사 리서치 반영
- 2026-04-09: 모노레포 스캐폴딩 + Docker PostgreSQL + JWT 인증 모듈 완성
- 2026-04-09: Prisma 7→5 다운그레이드 (안정성). 로그인 API 검증 완료
- 2026-04-09: 랜딩페이지 구현 (Satoshi + 다크테마 + 비대칭 레이아웃 + 포털 미리보기)
- 2026-04-09: AWS CDK 인프라 정의 (VPC, RDS, ECS Fargate, S3+CloudFront, Secrets Manager)

---

### Week 2: 고객 포털 + 커밋 로그 (04/16 ~ 04/22)

**목표:**
- [ ] 프로젝트 대시보드 UI
- [ ] GitHub webhook → Commit 자동 수집
- [ ] 커밋 목록 (newest first, sha+msg+시간, 일별 그룹핑)

**커밋 수:** -
**메모:**

---

### Week 3: 관리자 + 리포트 + 채팅 (04/23 ~ 04/29)

**목표:**
- [ ] 프로젝트 CRUD (관리자)
- [ ] 주간 리포트 폼 (completedItems + nextWeekPlan)
- [ ] Socket.IO 채팅 (텍스트만)
- [ ] 인보이스 상태 추적

**커밋 수:** -
**메모:**

---

### Week 4: QA + 배포 + 정리 (04/30 ~ 05/06)

**목표:**
- [ ] E2E 테스트
- [ ] AWS 배포 (S3+CloudFront+ECS Fargate+RDS)
- [ ] Route53 도메인 연결
- [ ] OG 태그 + Lighthouse 최적화

**커밋 수:** -
**메모:**

---

## 최종 결과

| 메트릭 | 값 |
|--------|-----|
| 총 커밋 수 | - |
| 총 소요 기간 | - |
| Lighthouse 점수 | - |
| 테스트 커버리지 | - |

## 의뢰인 코멘트

> (Dash4 자체 구축이므로 자체 평가로 대체)
