"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getApiClient, SnippetResponse } from "@/lib/api";
import { Button } from "@/components/ui/Button";

export default function SnippetsPage() {
  const [snippets, setSnippets] = useState<SnippetResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const api = getApiClient();

  useEffect(() => {
    const loadSnippets = async () => {
      try {
        setIsLoading(true);
        const data = await api.getPublicSnippets();
        setSnippets(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "스니펫 로드 실패");
      } finally {
        setIsLoading(false);
      }
    };

    loadSnippets();
  }, [api]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-editor-fg mb-2">공개 스니펫</h1>
        <p className="text-editor-fg text-opacity-70">
          커뮤니티에서 공유한 FreeLang 코드 스니펫을 둘러보세요.
        </p>
      </div>

      {/* 액션 */}
      <div className="mb-6">
        <Link href="/editor">
          <Button variant="primary">새 스니펫 작성</Button>
        </Link>
      </div>

      {/* 로딩 */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="animate-spin w-12 h-12 border-4 border-dark-border border-t-editor-fg rounded-full mx-auto mb-4" />
          <p className="text-editor-fg text-opacity-70">로드 중...</p>
        </div>
      )}

      {/* 에러 */}
      {error && (
        <div className="bg-state-error bg-opacity-10 border border-state-error border-opacity-50 rounded p-4">
          <p className="text-state-error">{error}</p>
        </div>
      )}

      {/* 스니펫 그리드 */}
      {!isLoading && snippets.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {snippets.map((snippet) => (
            <Link
              key={snippet.id}
              href={`/snippets/${snippet.share_token}`}
              className="bg-dark-secondary border border-dark-border rounded-lg p-4 hover:border-editor-fg transition-colors group"
            >
              <div className="mb-3">
                <h3 className="font-bold text-editor-fg group-hover:text-syntax-keyword transition-colors mb-1">
                  {snippet.title}
                </h3>
                <p className="text-editor-fg text-opacity-50 text-sm">
                  by {snippet.username}
                </p>
              </div>

              {snippet.description && (
                <p className="text-editor-fg text-opacity-70 text-sm mb-3 line-clamp-2">
                  {snippet.description}
                </p>
              )}

              <div className="flex items-center justify-between">
                <span className="text-editor-fg text-opacity-50 text-xs">
                  {snippet.code.split("\n").length} 줄
                </span>
                <span className="text-editor-fg text-opacity-50 text-xs">
                  👁 {snippet.view_count}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* 빈 상태 */}
      {!isLoading && snippets.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-editor-fg text-opacity-50 mb-4">
            아직 공개된 스니펫이 없습니다.
          </p>
          <Link href="/editor">
            <Button variant="secondary">첫 스니펫을 만들어보세요!</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
