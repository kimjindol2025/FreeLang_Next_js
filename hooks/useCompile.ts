"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getApiClient, CompileResponse } from "@/lib/api";
import { getCompileWS, CompileResult, WSState } from "@/lib/ws";
import { useEditorStore } from "@/store/editorStore";

export interface CompileState {
  result: CompileResponse | null;
  isRunning: boolean;
  error: string | null;
  output: string;
  duration_ms: number;
}

export function useCompile() {
  const api = getApiClient();
  const ws = useCompileWS();
  const [state, setState] = useState<CompileState>({
    result: null,
    isRunning: false,
    error: null,
    output: "",
    duration_ms: 0,
  });

  const { code, addToHistory, setLastResult } = useEditorStore();
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // WebSocket 연결 설정
  useEffect(() => {
    const connectWS = async () => {
      try {
        await ws.connect("/ws/compile/");
      } catch (error) {
        console.warn("WebSocket 연결 실패, REST API 폴백 사용:", error);
      }
    };

    connectWS();

    // WebSocket 이벤트 리스너 등록
    unsubscribeRef.current = ws.on("result", (data) => {
      if (typeof data === "object" && data !== null && "success" in data) {
        const result = data as CompileResult;
        setState({
          result: null,
          isRunning: false,
          error: result.error || null,
          output: result.output,
          duration_ms: result.duration_ms,
        });

        // 히스토리에 추가
        addToHistory({
          id: Date.now(),
          code,
          output: result.output,
          error_msg: result.error || "",
          duration_ms: result.duration_ms,
          status: result.success ? "success" : "error",
          created_at: new Date().toISOString(),
        });

        // 마지막 결과 저장
        setLastResult({
          id: Date.now(),
          code,
          output: result.output,
          error_msg: result.error || "",
          duration_ms: result.duration_ms,
          status: result.success ? "success" : "error",
          created_at: new Date().toISOString(),
        });
      }
    });

    return () => {
      unsubscribeRef.current?.();
    };
  }, [ws, code, addToHistory, setLastResult]);

  // REST API를 사용한 컴파일 (폴백)
  const compileViaREST = useCallback(
    async (sourceCode: string, timeout: number = 10) => {
      try {
        setState((prev) => ({ ...prev, isRunning: true, error: null }));

        const result = await api.compile({
          code: sourceCode,
          timeout,
        });

        setState({
          result,
          isRunning: false,
          error: result.error_msg || null,
          output: result.output,
          duration_ms: result.duration_ms,
        });

        // 히스토리에 추가
        addToHistory({
          id: result.id,
          code: result.code,
          output: result.output,
          error_msg: result.error_msg,
          duration_ms: result.duration_ms,
          status: result.status,
          created_at: result.created_at,
        });

        // 마지막 결과 저장
        setLastResult(result);

        return result;
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "컴파일 실패";
        setState((prev) => ({
          ...prev,
          isRunning: false,
          error: errorMsg,
        }));
        throw error;
      }
    },
    [api, addToHistory, setLastResult]
  );

  // WebSocket을 사용한 컴파일
  const compileViaWS = useCallback(
    async (sourceCode: string, timeout: number = 10) => {
      if (!ws.isConnected()) {
        // WebSocket 연결 안 됨, REST 사용
        return compileViaREST(sourceCode, timeout);
      }

      setState((prev) => ({ ...prev, isRunning: true, error: null }));

      try {
        ws.send({
          type: "compile",
          code: sourceCode,
          timeout,
        });

        // WebSocket 결과는 이벤트 리스너에서 처리됨
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "WebSocket 전송 실패";
        setState((prev) => ({
          ...prev,
          isRunning: false,
          error: errorMsg,
        }));
        throw error;
      }
    },
    [ws, compileViaREST]
  );

  // 자동으로 최적의 방법 선택
  const compile = useCallback(
    async (sourceCode: string = code, timeout: number = 10) => {
      if (!sourceCode.trim()) {
        setState({
          result: null,
          isRunning: false,
          error: "코드가 비어있습니다",
          output: "",
          duration_ms: 0,
        });
        return;
      }

      if (ws.isConnected()) {
        return compileViaWS(sourceCode, timeout);
      } else {
        return compileViaREST(sourceCode, timeout);
      }
    },
    [code, ws, compileViaWS, compileViaREST]
  );

  // 빠른 실행 (Ctrl+Enter)
  const quickRun = useCallback(async () => {
    await compile(code, 10);
  }, [code, compile]);

  return {
    ...state,
    compile,
    quickRun,
    isConnected: ws.isConnected(),
    wsState: ws.getState(),
  };
}

// WebSocket 싱글톤 참조를 위한 헬퍼
function useCompileWS() {
  const [ws] = useState(() => getCompileWS());
  return ws;
}
