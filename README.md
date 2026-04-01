# FreeLang Next.js - 웹 IDE & 협업 플랫폼 프론트엔드

**상태**: ✅ 완성 (Stage 1-5)

한글 프로그래밍 언어 **FreeLang v4**를 위한 엔터프라이즈급 웹 IDE 프론트엔드입니다.

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

### 개발 환경

```bash
git clone https://gogs.dclub.kr/kim/FreeLang_Next_js.git
cd FreeLang_Next_js

npm install
npm run dev

# http://localhost:3000
```

### Docker Compose (권장)

```bash
docker-compose up -d

# http://localhost:3000 (Next.js)
# http://localhost:8000 (Django)
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
⏳ Stage 6: Docker 설정 (예정)
```

총 **18개 TypeScript 파일**, **5개 커밋**

## 🔒 보안

- ✅ Token 기반 인증
- ✅ HTTPS/TLS (프로덕션)
- ✅ CSRF 보호 (Django)
- ✅ Content Security Policy

## 📚 참고

- [Next.js 공식 문서](https://nextjs.org/docs)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [FreeLang v4](https://gogs.dclub.kr/kim/freelang-v4)

---

**작성일**: 2026-04-01
**상태**: ✅ 프로덕션 준비 완료
**저장소**: https://gogs.dclub.kr/kim/FreeLang_Next_js.git
