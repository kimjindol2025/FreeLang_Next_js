"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getCollabWS, CollabInit, CollabMessage, WSState } from "@/lib/ws";
import { useEditorStore } from "@/store/editorStore";

export interface CollabState {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  participantCount: number;
}

export function useCollab(sessionId?: string) {
  const [state, setState] = useState<CollabState>({
    isConnected: false,
    isConnecting: false,
    error: null,
    participantCount: 1,
  });

  const ws = useRef<ReturnType<typeof getCollabWS> | null>(null);
  const currentSessionId = useRef<string | null>(sessionId || null);
  const lastCodeRef = useRef<string>("");

  const {
    code,
    setCode,
    setRemoteCode,
    setSessionId,
    setIsCollaborating,
    setRemoteCursor,
    removeRemoteCursor,
  } = useEditorStore();

  // WebSocket 연결 설정
  useEffect(() => {
    const connectCollab = async () => {
      if (!sessionId) return;

      if (!ws.current) {
        ws.current = getCollabWS(sessionId);
      }

      setState((prev) => ({ ...prev, isConnecting: true, error: null }));

      try {
        await ws.current.connect(`/ws/collab/${sessionId}/`);
        setSessionId(sessionId);
        setIsCollaborating(true);

        setState((prev) => ({
          ...prev,
          isConnected: true,
          isConnecting: false,
        }));
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "협업 연결 실패";
        setState((prev) => ({
          ...prev,
          isConnecting: false,
          error: errorMsg,
          isConnected: false,
        }));
      }
    };

    connectCollab();

    return () => {
      if (ws.current && sessionId) {
        ws.current.disconnect();
        setIsCollaborating(false);
      }
    };
  }, [sessionId, setSessionId, setIsCollaborating]);

  // 초기화 메시지 처리
  useEffect(() => {
    if (!ws.current) return;

    const handleInit = (data: unknown) => {
      if (typeof data === "object" && data !== null && "code" in data) {
        const init = data as CollabInit;
        setCode(init.code);
        setRemoteCode(init.code);
        lastCodeRef.current = init.code;
      }
    };

    const unsubscribe = ws.current.on("init", handleInit);
    return () => unsubscribe();
  }, [setCode, setRemoteCode]);

  // 원격 코드 변경 처리
  useEffect(() => {
    if (!ws.current) return;

    const handleCodeChange = (data: unknown) => {
      if (typeof data === "object" && data !== null && "code" in data) {
        const message = data as CollabMessage & { code: string };
        setRemoteCode(message.code);
        // 자신의 메시지는 아래에서 필터링됨
        if (message.code !== code) {
          setCode(message.code);
          lastCodeRef.current = message.code;
        }
      }
    };

    const unsubscribe = ws.current.on("code_change", handleCodeChange);
    return () => unsubscribe();
  }, [code, setCode, setRemoteCode]);

  // 원격 커서 이동 처리
  useEffect(() => {
    if (!ws.current) return;

    const handleCursorMove = (data: unknown) => {
      if (
        typeof data === "object" &&
        data !== null &&
        "line" in data &&
        "column" in data
      ) {
        const message = data as CollabMessage & {
          line: number;
          column: number;
        };
        // 실제 구현에서는 userId를 포함해야 함
        setRemoteCursor("remote-1", {
          line: message.line,
          column: message.column,
        });
      }
    };

    const unsubscribe = ws.current.on("cursor_move", handleCursorMove);
    return () => unsubscribe();
  }, [setRemoteCursor]);

  // 코드 변경 전송 (debounced)
  const sendCodeChange = useCallback(() => {
    if (!ws.current || !ws.current.isConnected()) {
      return;
    }

    // 코드가 변경되었을 때만 전송
    if (code !== lastCodeRef.current) {
      ws.current.send({
        type: "code_change",
        code,
      });
      lastCodeRef.current = code;
    }
  }, [code]);

  // 커서 이동 전송
  const sendCursorMove = useCallback((line: number, column: number) => {
    if (!ws.current || !ws.current.isConnected()) {
      return;
    }

    ws.current.send({
      type: "cursor_move",
      line,
      column,
    });
  }, []);

  // Debounced 코드 변경 전송 (500ms)
  useEffect(() => {
    const timer = setTimeout(sendCodeChange, 500);
    return () => clearTimeout(timer);
  }, [sendCodeChange]);

  // 연결 해제
  const disconnect = useCallback(() => {
    if (ws.current) {
      ws.current.disconnect();
      setIsCollaborating(false);
      setState((prev) => ({ ...prev, isConnected: false }));
    }
  }, [setIsCollaborating]);

  return {
    ...state,
    sendCursorMove,
    disconnect,
    wsState: ws.current?.getState() || WSState.DISCONNECTED,
  };
}
