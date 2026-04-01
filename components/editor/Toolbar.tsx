"use client";

import React, { useCallback, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useEditorStore } from "@/store/editorStore";
import { useCompile } from "@/hooks/useCompile";
import { getApiClient } from "@/lib/api";

export interface ToolbarProps {
  onShare?: () => void;
  sessionId?: string;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onShare, sessionId }) => {
  const { code } = useEditorStore();
  const { compile, isRunning } = useCompile();
  const { success, error: showError } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const api = getApiClient();

  // 실행
  const handleRun = useCallback(async () => {
    try {
      await compile(code, 30);
      success("✓ 실행 완료");
    } catch {
      showError("실행 실패");
    }
  }, [code, compile, success, showError]);

  // 초기화
  const handleClear = useCallback(() => {
    if (confirm("정말로 코드를 초기화하시겠습니까?")) {
      // 코드 초기화는 store에서 처리
    }
  }, []);

  // 저장
  const handleSave = useCallback(async () => {
    if (!api.isAuthenticated()) {
      showError("로그인이 필요합니다");
      return;
    }

    if (!code.trim()) {
      showError("저장할 코드가 없습니다");
      return;
    }

    setIsSaving(true);
    try {
      await api.createSnippet({
        title: `스니펫 ${new Date().toLocaleTimeString()}`,
        code,
        is_public: false,
      });
      success("✓ 스니펫이 저장되었습니다");
    } catch {
      showError("저장 실패");
    } finally {
      setIsSaving(false);
    }
  }, [code, api, success, showError]);

  // 공유
  const handleShare = useCallback(() => {
    onShare?.();
  }, [onShare]);

  // 복사
  const handleCopy = useCallback(async () => {
    try {
      const baseUrl =
        typeof window !== "undefined"
          ? window.location.origin
          : "http://localhost:3000";
      const encodedCode = Buffer.from(code).toString("base64");
      const shareUrl = `${baseUrl}/?code=${encodedCode}`;

      await navigator.clipboard.writeText(shareUrl);
      success("✓ 공유 링크가 복사되었습니다");
    } catch {
      showError("복사 실패");
    }
  }, [code, success, showError]);

  return (
    <div className="flex items-center justify-between bg-dark-secondary border border-dark-border rounded-lg p-3 gap-2">
      <div className="flex items-center gap-2">
        <Button
          variant="primary"
          size="md"
          onClick={handleRun}
          disabled={isRunning}
          isLoading={isRunning}
          title="Ctrl+Enter"
        >
          ▶ Run
        </Button>

        <Button variant="ghost" size="md" onClick={handleClear}>
          🗑 Clear
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="md"
          onClick={handleSave}
          disabled={isSaving}
          isLoading={isSaving}
        >
          💾 Save
        </Button>

        <Button variant="secondary" size="md" onClick={handleCopy}>
          🔗 Copy
        </Button>

        {onShare && (
          <Button variant="secondary" size="md" onClick={handleShare}>
            📤 Share
          </Button>
        )}

        {sessionId && (
          <div className="flex items-center gap-2 ml-2 pl-2 border-l border-dark-border">
            <span className="text-editor-fg text-opacity-50 text-sm">
              🤝 Collab
            </span>
          </div>
        )}
      </div>

      <div className="text-editor-fg text-opacity-50 text-xs hidden sm:block">
        Ctrl+Enter to run
      </div>
    </div>
  );
};

Toolbar.displayName = "Toolbar";
