import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export interface ExecutionResult {
  id: number;
  code: string;
  output: string;
  error_msg: string;
  duration_ms: number;
  status: "success" | "error" | "timeout";
  created_at: string;
}

export interface HistoryItem {
  id: number;
  code: string;
  output: string;
  error_msg: string;
  duration_ms: number;
  status: "success" | "error" | "timeout";
  created_at: string;
}

export interface CursorPosition {
  line: number;
  column: number;
}

export interface EditorState {
  // 에디터 상태
  code: string;
  setCode: (code: string) => void;

  // 실행 결과
  lastResult: ExecutionResult | null;
  setLastResult: (result: ExecutionResult | null) => void;

  // 실행 상태
  isRunning: boolean;
  setIsRunning: (running: boolean) => void;

  // 활성 탭
  activeTab: "output" | "errors" | "history";
  setActiveTab: (tab: "output" | "errors" | "history") => void;

  // 실행 이력
  history: HistoryItem[];
  addToHistory: (item: HistoryItem) => void;
  clearHistory: () => void;

  // 협업 세션
  sessionId: string | null;
  setSessionId: (id: string | null) => void;
  isCollaborating: boolean;
  setIsCollaborating: (collaborating: boolean) => void;
  remoteCode: string;
  setRemoteCode: (code: string) => void;

  // 원격 커서
  remoteCursors: Map<string, CursorPosition>;
  setRemoteCursor: (userId: string, position: CursorPosition) => void;
  removeRemoteCursor: (userId: string) => void;

  // UI 상태
  showSidebar: boolean;
  setShowSidebar: (show: boolean) => void;

  // 저장 상태
  isSaved: boolean;
  setIsSaved: (saved: boolean) => void;

  // 초기화
  reset: () => void;
}

const initialState = {
  code: "",
  lastResult: null,
  isRunning: false,
  activeTab: "output" as const,
  history: [],
  sessionId: null,
  isCollaborating: false,
  remoteCode: "",
  remoteCursors: new Map(),
  showSidebar: true,
  isSaved: true,
};

export const useEditorStore = create<EditorState>()(
  subscribeWithSelector((set) => ({
    ...initialState,

    setCode: (code) => set({ code, isSaved: false }),

    setLastResult: (result) => set({ lastResult: result }),

    setIsRunning: (running) => set({ isRunning: running }),

    setActiveTab: (tab) => set({ activeTab: tab }),

    addToHistory: (item) =>
      set((state) => ({
        history: [item, ...state.history].slice(0, 100), // 최대 100개 유지
      })),

    clearHistory: () => set({ history: [] }),

    setSessionId: (id) => set({ sessionId: id }),

    setIsCollaborating: (collaborating) => set({ isCollaborating: collaborating }),

    setRemoteCode: (code) => set({ remoteCode: code }),

    setRemoteCursor: (userId, position) =>
      set((state) => {
        const cursors = new Map(state.remoteCursors);
        cursors.set(userId, position);
        return { remoteCursors: cursors };
      }),

    removeRemoteCursor: (userId) =>
      set((state) => {
        const cursors = new Map(state.remoteCursors);
        cursors.delete(userId);
        return { remoteCursors: cursors };
      }),

    setShowSidebar: (show) => set({ showSidebar: show }),

    setIsSaved: (saved) => set({ isSaved: saved }),

    reset: () => set(initialState),
  }))
);

// Selector 헬퍼 함수
export const useCode = () => useEditorStore((state) => state.code);
export const useSetCode = () => useEditorStore((state) => state.setCode);
export const useLastResult = () => useEditorStore((state) => state.lastResult);
export const useIsRunning = () => useEditorStore((state) => state.isRunning);
export const useHistory = () => useEditorStore((state) => state.history);
export const useSessionId = () => useEditorStore((state) => state.sessionId);
export const useIsCollaborating = () =>
  useEditorStore((state) => state.isCollaborating);
export const useRemoteCursors = () =>
  useEditorStore((state) => state.remoteCursors);
