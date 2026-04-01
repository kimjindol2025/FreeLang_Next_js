import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // API는 app/api/[...path]/route.ts에서 처리

  // CORS 및 보안 헤더
  headers: async () => [
    {
      source: "/:path*",
      headers: [
        {
          key: "X-Content-Type-Options",
          value: "nosniff",
        },
        {
          key: "X-Frame-Options",
          value: "DENY",
        },
        {
          key: "X-XSS-Protection",
          value: "1; mode=block",
        },
      ],
    },
  ],

  // 환경 변수
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
    NEXT_PUBLIC_WS_URL:
      process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000",
  },

  // TypeScript
  typescript: {
    tsconfigPath: "./tsconfig.json",
  },
};

export default nextConfig;
