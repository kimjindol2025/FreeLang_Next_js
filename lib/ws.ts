// WebSocket 메시지 타입
export interface CompileMessage {
  type: "compile";
  code: string;
  timeout?: number;
}

export interface CompileResult {
  type: "result";
  success: boolean;
  output: string;
  error: string | null;
  duration_ms: number;
}

export interface CollabMessage {
  type: "code_change" | "cursor_move";
  code?: string;
  line?: number;
  column?: number;
}

export interface CollabInit {
  type: "init";
  code: string;
  session_id: string;
}

export interface WSError {
  type: "error";
  message: string;
}

export type WSMessage =
  | CompileMessage
  | CompileResult
  | CollabMessage
  | CollabInit
  | WSError;

// WebSocket 연결 상태
export enum WSState {
  CONNECTING = "CONNECTING",
  CONNECTED = "CONNECTED",
  DISCONNECTED = "DISCONNECTED",
  ERROR = "ERROR",
}

// WebSocket 관리 클래스
export class WebSocketManager {
  private ws: WebSocket | null = null;
  private url: string;
  private listeners: Map<string, Set<(data: unknown) => void>> = new Map();
  private state: WSState = WSState.DISCONNECTED;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private reconnectDelay = 1000;

  constructor(url?: string) {
    this.url =
      url ||
      process.env.NEXT_PUBLIC_WS_URL ||
      "ws://localhost:8000";
  }

  // 연결
  connect(path: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      const fullUrl = `${this.url}${path}`;
      this.state = WSState.CONNECTING;

      try {
        this.ws = new WebSocket(fullUrl);

        this.ws.onopen = () => {
          this.state = WSState.CONNECTED;
          this.reconnectAttempts = 0;
          this.emit("connect");
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.handleMessage(data);
          } catch (error) {
            console.error("WebSocket 메시지 파싱 실패:", error);
          }
        };

        this.ws.onerror = (error) => {
          this.state = WSState.ERROR;
          this.emit("error", error);
          reject(error);
        };

        this.ws.onclose = () => {
          this.state = WSState.DISCONNECTED;
          this.emit("disconnect");
          this.attemptReconnect(path);
        };
      } catch (error) {
        this.state = WSState.ERROR;
        reject(error);
      }
    });
  }

  // 자동 재연결 시도
  private attemptReconnect(path: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

      setTimeout(() => {
        console.log(`WebSocket 재연결 시도 ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
        this.connect(path).catch(() => {
          // 재연결 실패, 다시 시도 (attemptReconnect에서 처리)
        });
      }, delay);
    }
  }

  // 메시지 전송
  send(message: WSMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket 연결되지 않음");
    }
  }

  // 메시지 처리
  private handleMessage(data: unknown) {
    if (typeof data === "object" && data !== null && "type" in data) {
      const message = data as WSMessage;
      this.emit(message.type, data);
      this.emit("message", data);
    }
  }

  // 이벤트 리스너 등록
  on(event: string, callback: (data: unknown) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    // 언서브스크라이브 함수 반환
    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  // 한 번만 실행되는 리스너
  once(event: string, callback: (data: unknown) => void): () => void {
    const unsubscribe = this.on(event, (data) => {
      callback(data);
      unsubscribe();
    });
    return unsubscribe;
  }

  // 이벤트 발생
  private emit(event: string, data?: unknown) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => callback(data));
    }
  }

  // 연결 해제
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.state = WSState.DISCONNECTED;
  }

  // 상태 조회
  getState(): WSState {
    return this.state;
  }

  isConnected(): boolean {
    return this.state === WSState.CONNECTED;
  }
}

// 싱글톤 인스턴스
let compileWS: WebSocketManager | null = null;
let collabWS: WebSocketManager | null = null;

export function getCompileWS(): WebSocketManager {
  if (!compileWS) {
    compileWS = new WebSocketManager();
  }
  return compileWS;
}

export function getCollabWS(sessionId: string): WebSocketManager {
  if (!collabWS) {
    collabWS = new WebSocketManager();
  }
  return collabWS;
}
