"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getApiClient, SnippetResponse } from "@/lib/api";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function SharedSnippetPage() {
  const params = useParams();
  const token = params.token as string;

  const [snippet, setSnippet] = useState<SnippetResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const api = getApiClient();

  useEffect(() => {
    const loadSnippet = async () => {
      try {
        setIsLoading(true);
        const data = await api.getSharedSnippet(token);
        setSnippet(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "스니펫을 로드할 수 없습니다"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadSnippet();
  }, [token, api]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-dark-border border-t-editor-fg rounded-full mx-auto mb-4" />
          <p className="text-editor-fg text-opacity-70">로드 중...</p>
        </div>
      </div>
    );
  }

  if (error || !snippet) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-state-error bg-opacity-10 border border-state-error border-opacity-50 rounded p-4 mb-4">
          <p className="text-state-error mb-4">{error || "스니펫을 찾을 수 없습니다"}</p>
          <Link href="/snippets">
            <Button variant="secondary">스니펫 목록으로</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-dark-primary">
      {/* 헤더 */}
      <div className="border-b border-dark-border bg-dark-secondary p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-editor-fg">{snippet.title}</h1>
            <p className="text-editor-fg text-opacity-50 text-sm mt-1">
              by {snippet.username} • 👁 {snippet.view_count} 조회
            </p>
          </div>
          <Link href="/editor">
            <Button variant="primary">에디터에서 편집</Button>
          </Link>
        </div>
      </div>

      {/* 설명 */}
      {snippet.description && (
        <div className="border-b border-dark-border bg-dark-secondary bg-opacity-50 px-4 py-3">
          <p className="max-w-7xl mx-auto text-editor-fg text-opacity-70">
            {snippet.description}
          </p>
        </div>
      )}

      {/* 에디터 (읽기 전용) */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 flex overflow-hidden p-4 gap-4">
          {/* 코드 */}
          <div className="flex-1 min-w-0">
            <div className="h-full">
              <CodeEditor readOnly height="100%" />
            </div>
          </div>

          {/* 정보 패널 */}
          <div className="w-64 hidden lg:flex flex-col gap-4">
            <div className="bg-dark-secondary border border-dark-border rounded-lg p-4">
              <h3 className="text-editor-fg font-bold mb-3">정보</h3>
              <div className="space-y-2 text-sm text-editor-fg text-opacity-70">
                <div>
                  <div className="text-opacity-50">줄 수</div>
                  <div className="text-editor-fg">
                    {snippet.code.split("\n").length}
                  </div>
                </div>
                <div>
                  <div className="text-opacity-50">작성자</div>
                  <div className="text-editor-fg">{snippet.username}</div>
                </div>
                <div>
                  <div className="text-opacity-50">생성일</div>
                  <div className="text-editor-fg">
                    {new Date(snippet.created_at).toLocaleDateString("ko-KR")}
                  </div>
                </div>
              </div>
            </div>

            <Link href="/snippets" className="block">
              <Button variant="secondary" className="w-full">
                다른 스니펫 보기
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
