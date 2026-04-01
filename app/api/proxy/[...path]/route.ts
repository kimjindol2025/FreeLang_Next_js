import { NextRequest, NextResponse } from "next/server";

const DJANGO_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Django REST API 프록시
 *
 * CORS 문제를 해결하기 위해 Next.js API 라우트를 통해
 * Django 백엔드로 요청을 프록시합니다.
 *
 * 사용: /api/proxy/compile/ → Django /api/compile/
 */
async function handleRequest(
  request: NextRequest,
  context: { params: { path: string[] } }
) {
  const { params } = context;
  const path = params.path.join("/");
  const url = new URL(`${DJANGO_API_URL}/api/${path}`);

  // 쿼리 파라미터 전달
  const searchParams = request.nextUrl.searchParams;
  searchParams.forEach((value, key) => {
    url.searchParams.append(key, value);
  });

  try {
    // 요청 생성
    const init: RequestInit = {
      method: request.method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    // 바디가 있으면 전달 (POST, PUT, PATCH)
    if (["POST", "PUT", "PATCH"].includes(request.method)) {
      init.body = await request.text();
    }

    // 인증 토큰 전달
    const cookie = request.headers.get("cookie");
    if (cookie) {
      init.headers = {
        ...init.headers,
        cookie,
      };
    }

    const authHeader = request.headers.get("authorization");
    if (authHeader) {
      init.headers = {
        ...init.headers,
        authorization: authHeader,
      };
    }

    // Django API 호출
    const response = await fetch(url.toString(), init);

    // 응답 처리
    const contentType = response.headers.get("content-type");
    let body;

    if (contentType?.includes("application/json")) {
      body = await response.json();
    } else {
      body = await response.text();
    }

    return NextResponse.json(body, {
      status: response.status,
      headers: {
        "Content-Type": contentType || "application/json",
      },
    });
  } catch (error) {
    console.error("프록시 에러:", error);
    return NextResponse.json(
      { error: "Django API 호출 실패" },
      { status: 500 }
    );
  }
}

// Next.js 13+ App Router 호환
type RouteParams = Promise<{ path: string[] }>;

export async function GET(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  const resolvedParams = await params;
  return handleRequest(request, { params: resolvedParams });
}

export async function POST(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  const resolvedParams = await params;
  return handleRequest(request, { params: resolvedParams });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  const resolvedParams = await params;
  return handleRequest(request, { params: resolvedParams });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  const resolvedParams = await params;
  return handleRequest(request, { params: resolvedParams });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  const resolvedParams = await params;
  return handleRequest(request, { params: resolvedParams });
}
