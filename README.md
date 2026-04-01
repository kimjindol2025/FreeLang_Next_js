# FreeLang Next.js - 웹 IDE & 협업 플랫폼 프론트엔드

**상태**: ✅ 완성 & 배포 준비 완료 (Stage 1-6)

한글 프로그래밍 언어 **FreeLang v4**를 위한 엔터프라이즈급 웹 IDE 프론트엔드입니다.
Django 백엔드와 완전히 통합되었으며, 실시간 협업 편집을 지원합니다.

## 🎯 핵심 기능

### 에디터
- 🔤 **Monaco Editor** - VSCode와 동일한 강력한 코드 에디터
- 🎨 **FreeLang 문법** - 문법 강조, 자동완성, 괄호 매칭
- ⚡ **실시간 컴파일** - REST API + WebSocket 지원
- 📋 **실행 이력** - 최근 100개 실행 결과 저장
- 🔑 **Ctrl+Enter** - 빠른 실행 단축키

### 협업
- 🤝 **실시간 코드 동기화** - WebSocket 기반 다중 사용자 편집
- 👥 **커서 공유** - 다른 사용자의 커서 위치 표시
- 🔗 **세션 링크** - 협업 세션 쉽게 공유

### 스니펫
- 💾 **저장/관리** - 코드 스니펫 저장 및 조직
- 🔓 **공유 기능** - 고유 토큰으로 코드 공유
- 👁️ **조회수 추적** - 공유 스니펫 조회수 기록

## 🏗️ 기술 스택

- **Frontend**: Next.js 16 + TypeScript + Tailwind CSS
- **Editor**: Monaco Editor + FreeLang 문법
- **State**: Zustand (전역 상태관리)
- **HTTP**: Axios + REST API
- **WebSocket**: Browser WebSocket API (Django Channels)
- **Backend**: Django 5.0.6 + DRF
- **Container**: Docker + Docker Compose

## 🚀 빠른 시작

### 개발 환경 (로컬)

```bash
# 저장소 클론 (Gogs 또는 GitHub)
git clone https://gogs.dclub.kr/kim/FreeLang_Next_js.git
# 또는
git clone https://github.com/kimjindol2025/FreeLang_Next_js.git

cd FreeLang_Next_js

# 의존성 설치
npm install

# 개발 서버 시작 (HMR 활성)
npx next dev --webpack

# http://localhost:3000 접속
```

### Docker Compose (권장)

```bash
docker-compose up -d

# 자동으로 시작됨:
# - Next.js Frontend: http://localhost:3000
# - Django Backend: http://localhost:8000
# - PostgreSQL: port 5432
# - Redis: port 6379
```

### 환경 변수 설정

```bash
# .env.local 생성
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

## 📁 프로젝트 구조

```
freelang-next/
├── app/              # Next.js App Router (7 페이지)
├── components/       # React 컴포넌트 (9개)
├── hooks/            # 커스텀 훅 (3개)
├── lib/              # 유틸리티 (3개)
├── store/            # Zustand 상태 (1개)
├── Dockerfile        # Next.js 멀티스테이지 빌드
├── docker-compose.yml # 전체 스택 통합
└── tailwind.config.ts
```

## 🔌 API 통합

Django REST API 프록시를 통해 완전히 통합됩니다.

```
/api/compile/        컴파일 & 실행
/api/history/        실행 이력
/api/snippets/       스니펫 CRUD
/ws/compile/         실시간 컴파일 (WebSocket)
/ws/collab/:session/ 협업 편집 (WebSocket)
```

## 📊 개발 현황

```
✅ Stage 1: Next.js 프로젝트 생성 (19 파일)
✅ Stage 2: 설정 + 라이브러리 (814줄)
✅ Stage 3: 상태관리 + 훅 (667줄)
✅ Stage 4: React 컴포넌트 (923줄)
✅ Stage 5: 페이지 라우팅 (805줄)
✅ Stage 6: Docker + 배포 설정 (완성)
```

**최종 결과**:
- TypeScript 파일: 28개
- 총 코드: ~4,600줄
- 컴포넌트: 12개 (UI + Layout + Editor)
- 커스텀 훅: 3개 (useCompile, useCollab, useAuth)
- Git 커밋: 7개
- 저장소: Gogs + GitHub 동시 배포

## 💡 사용 방법

### 1. 코드 작성 및 실행
```
/editor → 코드 입력 → Ctrl+Enter → 결과 표시
```

### 2. 협업 편집
```
toolbar [협업] → 세션 ID 복사 → 다른 사용자에게 공유
→ 실시간 코드 동기화 + 커서 위치 공유
```

### 3. 스니펫 저장
```
toolbar [저장] → 로그인 필요 → 스니펫 저장 완료
/snippets → 공개 스니펫 조회 가능
```

## 🔒 보안

- ✅ Token 기반 인증 (Django Token Auth)
- ✅ HTTPS/TLS (프로덕션 배포 시)
- ✅ CSRF 보호 (Django Middleware)
- ✅ Content Security Policy (Next.js Headers)
- ✅ HttpOnly Cookie (토큰 저장)

## 🧪 테스트

```bash
# TypeScript 타입 검사
npm run build

# ESLint 검사
npm run lint

# 개발 서버에서 기능 테스트
# 1. /editor 페이지 로드
# 2. 코드 작성 후 Ctrl+Enter 실행
# 3. /snippets 페이지 확인 (공개 스니펫)
# 4. 협업 테스트: 두 브라우저/탭에서 /editor/[session_id] 접속
```

## 🐛 알려진 이슈

- Turbopack: Android/ARM64에서 미지원 → Webpack 사용
- WebSocket: 개발 환경에서 직접 연결 (프로덕션: Nginx 프록시)

## 📚 참고 자료

- [Next.js 공식 문서](https://nextjs.org/docs)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [FreeLang v4](https://gogs.dclub.kr/kim/freelang-v4)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## 📞 지원

문제가 발생하면 다음을 확인하세요:

1. Django 백엔드 실행 확인: `curl http://localhost:8000/api/history/`
2. Next.js 서버 실행 확인: `http://localhost:3000`
3. 환경 변수 설정 확인: `.env.local` 파일
4. 포트 충돌 확인: `lsof -i :3000` / `lsof -i :8000`

---

**최종 완성일**: 2026-04-01
**상태**: ✅ 프로덕션 배포 준비 완료
**저장소 (Gogs)**: https://gogs.dclub.kr/kim/FreeLang_Next_js.git
**저장소 (GitHub)**: https://github.com/kimjindol2025/FreeLang_Next_js
**작성자**: Claude (Anthropic) + 사용자
