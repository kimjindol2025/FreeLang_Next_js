"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getApiClient, SnippetResponse } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

export interface SidebarProps {
  isOpen?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true }) => {
  const { isAuthenticated } = useAuth();
  const [snippets, setSnippets] = useState<SnippetResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const api = getApiClient();

  // 스니펫 로드
  useEffect(() => {
    if (!isAuthenticated) return;

    const loadSnippets = async () => {
      setIsLoading(true);
      try {
        const data = await api.getSnippets();
        setSnippets(data);
      } catch (error) {
        console.error("스니펫 로드 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSnippets();
  }, [isAuthenticated, api]);

  if (!isOpen) {
    return null;
  }

  return (
    <aside className="w-64 bg-dark-secondary border-r border-dark-border overflow-y-auto">
      <div className="p-4">
        {/* 제목 */}
        <h2 className="text-editor-fg font-bold mb-4">스니펫</h2>

        {!isAuthenticated ? (
          <div className="text-editor-fg text-opacity-50 text-sm">
            <p className="mb-2">스니펫을 사용하려면 로그인이 필요합니다.</p>
            <Link
              href="/login"
              className="text-syntax-keyword hover:underline text-sm"
            >
              로그인 →
            </Link>
          </div>
        ) : isLoading ? (
          <div className="text-editor-fg text-opacity-50 text-sm">
            로드 중...
          </div>
        ) : snippets.length > 0 ? (
          <div className="space-y-2">
            {snippets.map((snippet) => (
              <Link
                key={snippet.id}
                href={`/editor?snippet=${snippet.id}`}
                className="block p-3 rounded hover:bg-dark-tertiary transition-colors text-editor-fg text-sm group"
              >
                <div className="font-medium truncate group-hover:text-syntax-keyword">
                  {snippet.title}
                </div>
                <div className="text-editor-fg text-opacity-50 text-xs mt-1">
                  {snippet.code.split("\n").length} 줄
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-editor-fg text-opacity-50 text-sm">
            스니펫이 없습니다.
          </div>
        )}

        {/* 추천 */}
        <div className="mt-6 pt-4 border-t border-dark-border">
          <h3 className="text-editor-fg font-bold mb-3 text-sm">추천</h3>
          <div className="space-y-2">
            <Link
              href="/snippets"
              className="block p-3 rounded hover:bg-dark-tertiary transition-colors text-editor-fg text-sm hover:text-syntax-keyword"
            >
              👥 공개 스니펫
            </Link>
            <Link
              href="/editor"
              className="block p-3 rounded hover:bg-dark-tertiary transition-colors text-editor-fg text-sm hover:text-syntax-keyword"
            >
              ✏️ 새 코드 작성
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
};

Sidebar.displayName = "Sidebar";
