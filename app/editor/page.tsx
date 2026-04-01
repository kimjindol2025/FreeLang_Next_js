"use client";

import React, { useState } from "react";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { OutputPanel } from "@/components/editor/OutputPanel";
import { Toolbar } from "@/components/editor/Toolbar";
import { CollabBar } from "@/components/editor/CollabBar";
import { Sidebar } from "@/components/layout/Sidebar";

export default function EditorPage() {
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <div className="h-[calc(100vh-64px)] flex bg-dark-primary">
      {/* 사이드바 */}
      <div
        className={`transition-all duration-300 border-r border-dark-border ${
          showSidebar ? "w-64" : "w-0"
        } overflow-hidden`}
      >
        <Sidebar isOpen={showSidebar} />
      </div>

      {/* 메인 에디터 영역 */}
      <div className="flex-1 flex flex-col gap-3 p-4 overflow-auto">
        {/* 협업 표시 */}
        <CollabBar />

        {/* 툴바 */}
        <Toolbar />

        {/* 에디터 + 출력 */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 min-h-0">
          {/* 에디터 */}
          <div className="min-w-0 h-full">
            <CodeEditor height="100%" />
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

      {/* 사이드바 토글 (모바일) */}
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className="sm:hidden absolute left-4 top-20 z-50 bg-dark-secondary border border-dark-border rounded p-2 text-editor-fg"
      >
        {showSidebar ? "✕" : "☰"}
      </button>
    </div>
  );
}
