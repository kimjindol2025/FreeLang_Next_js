"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { useEditorStore } from "@/store/editorStore";
import { useCompile } from "@/hooks/useCompile";

export const OutputPanel: React.FC = () => {
  const { lastResult, history, activeTab, setActiveTab } = useEditorStore();
  const { output, error, duration_ms } = useCompile();

  const currentOutput = lastResult?.output || output || "";
  const currentError = lastResult?.error_msg || error || "";
  const currentDuration = lastResult?.duration_ms || duration_ms || 0;
  const currentStatus = lastResult?.status || "idle";

  const statusStyles = {
    success: "success",
    error: "error",
    timeout: "warning",
    idle: "default",
  };

  return (
    <div className="h-full flex flex-col bg-dark-secondary border border-dark-border rounded-lg">
      {/* 탭 */}
      <div className="flex border-b border-dark-border">
        {(["output", "errors", "history"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "border-b-2 border-editor-fg text-editor-fg"
                : "text-editor-fg text-opacity-50 hover:text-opacity-70"
            }`}
          >
            {tab === "output" && "Output"}
            {tab === "errors" && "Errors"}
            {tab === "history" && "History"}
          </button>
        ))}
      </div>

      {/* 컨텐츠 */}
      <div className="flex-1 overflow-auto p-4">
        {activeTab === "output" && (
          <div>
            {/* 상태 배지 및 실행 시간 */}
            <div className="mb-3 flex items-center gap-2">
              <Badge variant={statusStyles[currentStatus] as any}>
                {currentStatus === "success"
                  ? "✓ Success"
                  : currentStatus === "error"
                  ? "✕ Error"
                  : currentStatus === "timeout"
                  ? "⏱ Timeout"
                  : "Idle"}
              </Badge>
              {currentDuration > 0 && (
                <span className="text-editor-fg text-opacity-50 text-sm">
                  {currentDuration}ms
                </span>
              )}
            </div>

            {/* 출력 */}
            <pre className="bg-editor-bg p-3 rounded border border-dark-border text-editor-fg font-mono text-sm overflow-auto max-h-64 whitespace-pre-wrap break-words">
              {currentOutput || "(출력 없음)"}
            </pre>
          </div>
        )}

        {activeTab === "errors" && (
          <div>
            {currentError ? (
              <div className="bg-state-error bg-opacity-10 border border-state-error border-opacity-50 rounded p-3">
                <p className="text-state-error font-mono text-sm">
                  {currentError}
                </p>
              </div>
            ) : (
              <p className="text-editor-fg text-opacity-50">(에러 없음)</p>
            )}
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-2">
            {history.length > 0 ? (
              history.map((item) => (
                <div
                  key={item.id}
                  className="bg-dark-tertiary border border-dark-border rounded p-3 text-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={item.status as any} size="sm">
                      {item.status === "success"
                        ? "✓"
                        : item.status === "error"
                        ? "✕"
                        : "⏱"}
                    </Badge>
                    <span className="text-editor-fg text-opacity-50 text-xs">
                      {new Date(item.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-editor-fg text-opacity-70 font-mono">
                    {item.output.substring(0, 100)}
                    {item.output.length > 100 && "..."}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-editor-fg text-opacity-50">
                (실행 이력 없음)
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

OutputPanel.displayName = "OutputPanel";
