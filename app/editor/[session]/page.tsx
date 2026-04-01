"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { OutputPanel } from "@/components/editor/OutputPanel";
import { Toolbar } from "@/components/editor/Toolbar";
import { CollabBar } from "@/components/editor/CollabBar";
import { useCollab } from "@/hooks/useCollab";

export default function CollabPage() {
  const params = useParams();
  const sessionId = params.session as string;

  // 협업 세션 초기화
  const { isConnected, error } = useCollab(sessionId);

  useEffect(() => {
    if (error) {
      console.error("협업 세션 에러:", error);
    }
  }, [error]);

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-dark-primary">
      {/* 연결 상태 */}
      {!isConnected && (
        <div className="bg-state-warning bg-opacity-20 border-b border-state-warning px-4 py-2">
          <p className="text-state-warning text-sm">
            협업 세션 연결 중... {error && `(${error})`}
          </p>
        </div>
      )}

      {/* 협업 정보 */}
      <div className="px-4 pt-4">
        <CollabBar sessionId={sessionId} />
      </div>

      {/* 메인 에디터 영역 */}
      <div className="flex-1 flex flex-col gap-3 p-4 overflow-auto min-h-0">
        {/* 툴바 */}
        <Toolbar sessionId={sessionId} />

        {/* 에디터 + 출력 */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 min-h-0">
          {/* 에디터 */}
          <div className="min-w-0 h-full">
            <CodeEditor sessionId={sessionId} height="100%" />
          </div>

          {/* 출력 패널 */}
          <div className="min-w-0 h-full hidden lg:block">
            <OutputPanel />
          </div>
        </div>

        {/* 모바일 출력 패널 */}
        <div className="lg:hidden h-64 min-w-0">
          <OutputPanel />
        </div>
      </div>

      {/* 세션 ID 정보 */}
      <div className="bg-dark-secondary border-t border-dark-border px-4 py-2 text-xs text-editor-fg text-opacity-50">
        세션 ID: <span className="font-mono">{sessionId}</span>
      </div>
    </div>
  );
}
