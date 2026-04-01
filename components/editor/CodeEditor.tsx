"use client";

import React, { useCallback, useEffect, useRef } from "react";
import Editor, { Monaco } from "@monaco-editor/react";
import * as Monaco_types from "monaco-editor";
import { registerFreeLangLanguage, FREELANG_LANGUAGE_ID } from "@/lib/freelang";
import { useEditorStore } from "@/store/editorStore";
import { useCompile } from "@/hooks/useCompile";
import { useCollab } from "@/hooks/useCollab";

export interface CodeEditorProps {
  sessionId?: string;
  readOnly?: boolean;
  height?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  sessionId,
  readOnly = false,
  height = "100%",
}) => {
  const editorRef = useRef<Monaco_types.editor.IStandaloneCodeEditor | null>(
    null
  );
  const monacoRef = useRef<Monaco | null>(null);

  const { code, setCode } = useEditorStore();
  const { quickRun } = useCompile();
  const { sendCursorMove } = useCollab(sessionId);

  // Monaco 에디터 마운트
  const handleEditorMount = useCallback(
    (editor: Monaco_types.editor.IStandaloneCodeEditor, monaco: Monaco) => {
      editorRef.current = editor;
      monacoRef.current = monaco;

      // FreeLang 언어 등록
      registerFreeLangLanguage();

      // 포커스 설정
      editor.focus();

      // Ctrl+Enter로 실행
      editor.addCommand(
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
        () => {
          quickRun();
        }
      );

      // 캐럿 위치 변경 시 커서 전송 (협업 모드)
      editor.onDidChangeCursorPosition((e) => {
        if (sessionId) {
          sendCursorMove(e.position.lineNumber, e.position.column);
        }
      });
    },
    [quickRun, sessionId, sendCursorMove]
  );

  // 코드 변경
  const handleCodeChange = useCallback(
    (value: string | undefined) => {
      if (value !== undefined) {
        setCode(value);
      }
    },
    [setCode]
  );

  // 테마 설정
  useEffect(() => {
    if (monacoRef.current) {
      monacoRef.current.editor.setTheme("freelang-dark");
    }
  }, []);

  return (
    <div className="w-full h-full border border-dark-border rounded-lg overflow-hidden">
      <Editor
        ref={editorRef}
        height={height}
        defaultLanguage={FREELANG_LANGUAGE_ID}
        defaultValue={code}
        value={code}
        onChange={handleCodeChange}
        onMount={handleEditorMount}
        theme="freelang-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "Fira Code, monospace",
          lineHeight: 1.6,
          lineNumbers: "on",
          wordWrap: "off",
          folding: true,
          autoClosingBrackets: "always",
          autoClosingQuotes: "always",
          formatOnPaste: false,
          formatOnType: false,
          trimAutoWhitespace: true,
          readOnly: readOnly,
          scrollBeyondLastLine: true,
          smoothScrolling: true,
          cursorBlinking: "blink",
          cursorStyle: "line",
          cursorWidth: 2,
          padding: { top: 16, bottom: 16 },
          renderWhitespace: "selection",
          tabSize: 2,
          insertSpaces: true,
          useTabStops: true,
          bracketPairColorization: {
            enabled: true,
          },
        }}
      />
    </div>
  );
};

CodeEditor.displayName = "CodeEditor";
