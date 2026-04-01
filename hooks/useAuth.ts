"use client";

import { useCallback, useEffect, useState } from "react";
import { getApiClient } from "@/lib/api";

export interface User {
  id: number;
  username: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  const api = getApiClient();

  // 초기 로드: localStorage에서 토큰 확인
  useEffect(() => {
    const checkAuth = async () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token && api.isAuthenticated()) {
          // 토큰이 있으면 인증 상태로 설정
          setState({
            user: null, // 향후 사용자 정보 API 추가 가능
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      }
    };

    checkAuth();
  }, [api]);

  const register = useCallback(
    async (username: string, password: string) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const response = await api.register(username, password);
        setState({
          user: { id: response.id, username: response.username },
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return response;
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "회원가입 실패";
        setState((prev) => ({ ...prev, isLoading: false, error: errorMsg }));
        throw error;
      }
    },
    [api]
  );

  const login = useCallback(
    async (username: string, password: string) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const response = await api.login(username, password);
        setState({
          user: { id: response.id, username: response.username },
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return response;
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "로그인 실패";
        setState((prev) => ({ ...prev, isLoading: false, error: errorMsg }));
        throw error;
      }
    },
    [api]
  );

  const logout = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      await api.logout();
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "로그아웃 실패";
      setState((prev) => ({ ...prev, isLoading: false, error: errorMsg }));
      throw error;
    }
  }, [api]);

  return {
    ...state,
    register,
    login,
    logout,
  };
}
