import { NextRequest, NextResponse } from "next/server";

const DJANGO_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function handleRequest(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  const path = params.path.join("/");
  const url = new URL(`${DJANGO_API_URL}/api/${path}`);

  const searchParams = request.nextUrl.searchParams;
  searchParams.forEach((value, key) => {
    url.searchParams.append(key, value);
  });

  try {
    const init: RequestInit = {
      method: request.method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (["POST", "PUT", "PATCH"].includes(request.method)) {
      init.body = await request.text();
    }

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

    const response = await fetch(url.toString(), init);
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
    console.error("API 프록시 에러:", error);
    return NextResponse.json(
      { error: "API 호출 실패" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, context);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, context);
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, context);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, context);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, context);
}
