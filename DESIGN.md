# Design System — Dash4

## Product Context
- **What this is:** AI 기반 투명 후불제 4주 MVP 제작 서비스 플랫폼
- **Who it's for:** 투자받은 비개발자 스타트업 창업자 (한국)
- **Space/industry:** MVP 개발 에이전시 / 프로덕타이즈드 서비스
- **Project type:** Hybrid (마케팅 랜딩 + 고객 포털 웹앱 + 관리자)

## Aesthetic Direction
- **Direction:** Industrial/Utilitarian + Luxury/Refined 하이브리드
- **Decoration level:** Intentional (포털 UI 미리보기가 시각 요소 역할)
- **Mood:** 프리미엄 컨설팅 펌의 자신감. 과하지 않지만 확실한 존재감. 기능 중심이되 세련됨.
- **Reference sites:** Purrweb (대담한 미니멀), Clay (프리미엄 에이전시), Linear (앱 UI 레퍼런스)
- **Anti-patterns:** mvp.dev 스타일의 밝은 파란색 SaaS 템플릿, 3열 아이콘 그리드, 보라색 그라디언트, 모든 것 중앙 정렬

## Typography
- **Display/Hero:** Satoshi (Fontshare CDN) — 기하학적이지만 따뜻한 산세리프. 경쟁사와 즉시 차별화.
- **Body (한글):** Pretendard (CDN: cdn.jsdelivr.net) — 한글 최적화, Apple SF 스타일 가독성
- **Body (영문):** Inter (폴백) — Pretendard가 커버하지 못하는 경우
- **UI/Labels:** Pretendard / Inter (본문과 동일)
- **Data/Tables:** JetBrains Mono (tabular-nums 지원) — 커밋 SHA, 코드, 숫자 정렬
- **Code:** JetBrains Mono
- **Loading:** CDN (Fontshare for Satoshi, jsDelivr for Pretendard, Google Fonts for JetBrains Mono)
- **Scale:**
  - xs: 12px / 0.75rem
  - sm: 14px / 0.875rem
  - base: 16px / 1rem
  - lg: 18px / 1.125rem
  - xl: 20px / 1.25rem
  - 2xl: 24px / 1.5rem
  - 3xl: 30px / 1.875rem
  - 4xl: 36px / 2.25rem
  - 5xl: 48px / 3rem
  - hero: 64px / 4rem

## Color

### Landing (다크 테마)
- **Approach:** Restrained (accent가 희소하고 의미 있게)
- **Background:** #0a0a0a
- **Surface:** #141414
- **Surface elevated:** #1c1c1c
- **Border:** #262626
- **Text primary:** #fafafa
- **Text secondary:** #a3a3a3
- **Text muted:** #737373

### Portal (라이트 테마)
- **Background:** #ffffff
- **Surface:** #f8f9fa
- **Surface elevated:** #ffffff
- **Border:** #e5e7eb
- **Text primary:** #1a1a1a
- **Text secondary:** #6b7280
- **Text muted:** #9ca3af

### Shared
- **Accent/Primary:** #2563eb (깊은 네이비 블루 — 신뢰, 전문성)
- **Accent hover:** #1d4ed8
- **Accent light:** #dbeafe (라이트 테마 배지/태그용)
- **Secondary:** #0ea5e9 (하이라이트, 링크)
- **Success:** #22c55e (PAID, 완료)
- **Warning:** #f59e0b (PENDING)
- **Error:** #ef4444
- **Info:** #6366f1

### CSS Variables
```css
:root {
  --color-bg: #ffffff;
  --color-surface: #f8f9fa;
  --color-surface-elevated: #ffffff;
  --color-border: #e5e7eb;
  --color-text: #1a1a1a;
  --color-text-secondary: #6b7280;
  --color-text-muted: #9ca3af;
  --color-accent: #2563eb;
  --color-accent-hover: #1d4ed8;
  --color-accent-light: #dbeafe;
  --color-secondary: #0ea5e9;
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #6366f1;
}

[data-theme="dark"] {
  --color-bg: #0a0a0a;
  --color-surface: #141414;
  --color-surface-elevated: #1c1c1c;
  --color-border: #262626;
  --color-text: #fafafa;
  --color-text-secondary: #a3a3a3;
  --color-text-muted: #737373;
}
```

## Spacing
- **Base unit:** 4px
- **Density:** Comfortable
- **Scale:**
  - 2xs: 2px
  - xs: 4px
  - sm: 8px
  - md: 16px
  - lg: 24px
  - xl: 32px
  - 2xl: 48px
  - 3xl: 64px
  - section-mobile: 48px
  - section-desktop: 80px

## Layout
- **Approach:** Hybrid (랜딩: creative-editorial, 포털: grid-disciplined)
- **Landing grid:** 12 columns, asymmetric sections (좌우 교차)
- **Portal grid:** 12 columns, single content column with tabs
- **Admin grid:** 12 columns, table-based layouts
- **Max content width:** 1200px (랜딩), 1024px (포털), 1280px (관리자)
- **Border radius:**
  - sm: 4px (inputs, small elements)
  - md: 6px (buttons, cards)
  - lg: 8px (panels, modals)
  - full: 9999px (avatars, badges)

## Motion
- **Approach:** Intentional (의미 있는 트랜지션만)
- **Easing:**
  - enter: cubic-bezier(0, 0, 0.2, 1) (ease-out)
  - exit: cubic-bezier(0.4, 0, 1, 1) (ease-in)
  - move: cubic-bezier(0.4, 0, 0.2, 1) (ease-in-out)
- **Duration:**
  - micro: 75ms (hover, toggle)
  - short: 150ms (button press, tab switch)
  - medium: 300ms (page transition, modal)
  - long: 500ms (section entrance on scroll)
- **Landing-specific:** 섹션 입장 애니메이션 (fade-up), 히어로 포털 UI 라이브 데모 애니메이션
- **Portal-specific:** 탭 전환, 스켈레톤 로딩 페이드, 채팅 메시지 슬라이드인

## Interaction States
모든 UI 기능에 다음 상태 정의 필수:
- **Loading:** 스켈레톤 UI (회색 블록 펄스 애니메이션)
- **Empty:** 따뜻한 안내 메시지 + 행동 유도 CTA
- **Error:** 빨간색 경고 + 재시도 버튼
- **Success:** 초록색 확인 메시지 (3초 후 자동 닫힘)

## Responsive
- **Mobile (375px):** 단일 컬럼 스택, 탭 하단 고정, 히어로 텍스트 축소
- **Tablet (768px):** 2칼럼 그리드, 히어로 스택 (이미지 아래)
- **Desktop (1024px+):** 풀 레이아웃, 히어로 좌우 배치

## Accessibility
- **Contrast:** WCAG AA (4.5:1 text, 3:1 UI elements)
- **Touch targets:** 최소 44px
- **Keyboard:** Tab + Enter로 모든 인터랙션 접근 가능
- **Focus:** visible focus ring (2px solid accent, 2px offset)
- **Screen readers:** ARIA landmarks, 의미 있는 alt text

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-09 | 초기 디자인 시스템 생성 | /design-consultation, 경쟁사 리서치 기반 |
| 2026-04-09 | Display 폰트 Satoshi 선택 | 경쟁사(Inter/Poppins)와 차별화 |
| 2026-04-09 | Accent #2563eb (깊은 네이비) | 밝은 파란색 SaaS 템플릿과 차별화 |
| 2026-04-09 | 랜딩=다크, 포털=라이트 | 프리미엄 랜딩 + 가독성 높은 포털 |
| 2026-04-09 | 비대칭 레이아웃 (AI 슬롭 방지) | 3열 그리드 금지, 좌우 교차 섹션 |
| 2026-04-09 | 히어로에 포털 UI 라이브 데모 | 경쟁사에 없는 고유 요소 |
