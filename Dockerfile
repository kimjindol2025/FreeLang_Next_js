# 멀티 스테이지 빌드 - Stage 1: 의존성 설치
FROM node:20-alpine AS deps

WORKDIR /app

# 의존성 파일 복사
COPY package.json package-lock.json ./

# 프로덕션 의존성만 설치
RUN npm ci --omit=dev

# Stage 2: 소스 코드 빌드
FROM node:20-alpine AS builder

WORKDIR /app

# 모든 의존성 설치 (빌드 의존성 포함)
COPY package.json package-lock.json ./
RUN npm ci

# 소스 코드 복사
COPY . .

# 환경 변수 설정
ENV NEXT_TELEMETRY_DISABLED=1

# Next.js 빌드
RUN npm run build

# Stage 3: 런타임
FROM node:20-alpine

WORKDIR /app

# 필수 패키지
RUN apk add --no-cache dumb-init

# 비프로덕션 사용자
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# 빌드 결과물 복사 (Stage 2에서)
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 프로덕션 의존성 복사 (Stage 1에서)
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules

# 사용자 전환
USER nextjs

# 포트 노출
EXPOSE 3000

# 환경 변수
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# 엔트리포인트
ENTRYPOINT ["dumb-init", "--"]

# 시작 명령
CMD ["node", "server.js"]
