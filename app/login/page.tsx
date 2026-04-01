"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/Toast";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { success, error: showError } = useToast();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password.trim()) {
      setError("사용자명과 비밀번호를 입력해주세요");
      return;
    }

    setIsLoading(true);
    try {
      await login(username, password);
      success("✓ 로그인되었습니다");
      router.push("/editor");
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "로그인에 실패했습니다";
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-primary px-4">
      <div className="w-full max-w-md">
        {/* 로고 */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-editor-fg to-syntax-function rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-editor-bg font-bold text-2xl">F</span>
          </div>
          <h1 className="text-3xl font-bold text-editor-fg">FreeLang</h1>
          <p className="text-editor-fg text-opacity-50 mt-2">
            온라인 코드 에디터에 로그인하세요
          </p>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-state-error bg-opacity-10 border border-state-error border-opacity-50 rounded p-3">
              <p className="text-state-error text-sm">{error}</p>
            </div>
          )}

          {/* 사용자명 */}
          <div>
            <label className="block text-editor-fg text-sm font-medium mb-2">
              사용자명
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-dark-secondary border border-dark-border rounded-lg text-editor-fg focus:outline-none focus:border-editor-fg transition-colors"
              placeholder="사용자명"
            />
          </div>

          {/* 비밀번호 */}
          <div>
            <label className="block text-editor-fg text-sm font-medium mb-2">
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-dark-secondary border border-dark-border rounded-lg text-editor-fg focus:outline-none focus:border-editor-fg transition-colors"
              placeholder="비밀번호"
            />
          </div>

          {/* 로그인 버튼 */}
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={isLoading}
          >
            로그인
          </Button>
        </form>

        {/* 회원가입 링크 */}
        <div className="text-center mt-6">
          <p className="text-editor-fg text-opacity-70 text-sm">
            계정이 없으신가요?{" "}
            <Link href="/register" className="text-syntax-keyword hover:underline">
              회원가입
            </Link>
          </p>
        </div>

        {/* 에디터로 돌아가기 */}
        <div className="text-center mt-4">
          <Link href="/editor" className="text-editor-fg text-opacity-50 hover:text-opacity-70 text-sm">
            로그인 없이 계속하기
          </Link>
        </div>
      </div>
    </div>
  );
}
