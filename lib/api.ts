import axios, { AxiosInstance, AxiosError } from "axios";

// API 응답 타입
export interface CompileRequest {
  code: string;
  timeout?: number;
  force_run?: boolean;
}

export interface CompileResponse {
  id: number;
  code: string;
  output: string;
  error_msg: string;
  duration_ms: number;
  status: "success" | "error" | "timeout";
  username?: string;
  parsed_errors?: Array<{ line: number; message: string }>;
  created_at: string;
}

export interface HistoryResponse {
  count: number;
  results: CompileResponse[];
}

export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  id: number;
  username: string;
  token: string;
}

export interface SnippetRequest {
  title: string;
  description?: string;
  code: string;
  is_public?: boolean;
}

export interface SnippetResponse {
  id: number;
  title: string;
  description?: string;
  code: string;
  username: string;
  is_public: boolean;
  view_count: number;
  share_token: string;
  created_at: string;
  updated_at: string;
}

export interface ErrorResponse {
  detail?: string;
  [key: string]: unknown;
}

// API 클라이언트 클래스
class APIClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor(baseURL?: string) {
    this.client = axios.create({
      baseURL: baseURL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // 토큰 로드 (localStorage에서)
    this.loadToken();

    // 요청 인터셉터: 토큰 추가
    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Token ${this.token}`;
      }
      return config;
    });

    // 응답 인터셉터: 에러 처리
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ErrorResponse>) => {
        if (error.response?.status === 401) {
          this.clearToken();
        }
        return Promise.reject(error);
      }
    );
  }

  // Token 관리
  private loadToken() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("token");
    }
  }

  saveToken(token: string) {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  // 코드 컴파일
  async compile(request: CompileRequest): Promise<CompileResponse> {
    const response = await this.client.post<CompileResponse>(
      "/compile/",
      request
    );
    return response.data;
  }

  // 실행 이력 조회
  async getHistory(limit: number = 50): Promise<HistoryResponse> {
    const response = await this.client.get<HistoryResponse>("/history/", {
      params: { limit },
    });
    return response.data;
  }

  // 회원가입
  async register(
    username: string,
    password: string
  ): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>("/auth/register/", {
      username,
      password,
      password_confirm: password,
    });
    if (response.data.token) {
      this.saveToken(response.data.token);
    }
    return response.data;
  }

  // 로그인
  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>("/auth/login/", {
      username,
      password,
    });
    if (response.data.token) {
      this.saveToken(response.data.token);
    }
    return response.data;
  }

  // 로그아웃
  async logout(): Promise<void> {
    try {
      await this.client.post("/auth/logout/", {});
    } finally {
      this.clearToken();
    }
  }

  // 스니펫 목록 (인증 필수)
  async getSnippets(): Promise<SnippetResponse[]> {
    const response = await this.client.get<SnippetResponse[]>("/snippets/");
    return response.data;
  }

  // 스니펫 상세
  async getSnippet(id: number): Promise<SnippetResponse> {
    const response = await this.client.get<SnippetResponse>(
      `/snippets/${id}/`
    );
    return response.data;
  }

  // 스니펫 생성
  async createSnippet(request: SnippetRequest): Promise<SnippetResponse> {
    const response = await this.client.post<SnippetResponse>(
      "/snippets/",
      request
    );
    return response.data;
  }

  // 스니펫 수정
  async updateSnippet(
    id: number,
    request: Partial<SnippetRequest>
  ): Promise<SnippetResponse> {
    const response = await this.client.put<SnippetResponse>(
      `/snippets/${id}/`,
      request
    );
    return response.data;
  }

  // 스니펫 삭제
  async deleteSnippet(id: number): Promise<void> {
    await this.client.delete(`/snippets/${id}/`);
  }

  // 공개 스니펫 목록
  async getPublicSnippets(): Promise<SnippetResponse[]> {
    const response = await this.client.get<SnippetResponse[]>(
      "/snippets/public/"
    );
    return response.data;
  }

  // 공유 스니펫 조회
  async getSharedSnippet(token: string): Promise<SnippetResponse> {
    const response = await this.client.get<SnippetResponse>(
      `/snippets/share/${token}/`
    );
    return response.data;
  }
}

// 싱글톤 인스턴스
let apiInstance: APIClient | null = null;

export function getApiClient(): APIClient {
  if (!apiInstance) {
    apiInstance = new APIClient();
  }
  return apiInstance;
}

export default APIClient;
