"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/Toast";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { success, error: showError } = useToast();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password.trim() || !passwordConfirm.trim()) {
      setError("모든 필드를 입력해주세요");
      return;
    }

    if (password.length < 6) {
      setError("비밀번호는 최소 6자 이상이어야 합니다");
      return;
    }

    if (password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다");
      return;
    }

    setIsLoading(true);
    try {
      await register(username, password);
      success("✓ 회원가입되었습니다");
      router.push("/editor");
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "회원가입에 실패했습니다";
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
            새 계정을 만들어 시작하세요
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
              maxLength={30}
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
              placeholder="최소 6자"
              minLength={6}
            />
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label className="block text-editor-fg text-sm font-medium mb-2">
              비밀번호 확인
            </label>
            <input
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="w-full px-4 py-2 bg-dark-secondary border border-dark-border rounded-lg text-editor-fg focus:outline-none focus:border-editor-fg transition-colors"
              placeholder="비밀번호 확인"
              minLength={6}
            />
          </div>

          {/* 회원가입 버튼 */}
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={isLoading}
          >
            회원가입
          </Button>
        </form>

        {/* 로그인 링크 */}
        <div className="text-center mt-6">
          <p className="text-editor-fg text-opacity-70 text-sm">
            이미 계정이 있으신가요?{" "}
            <Link href="/login" className="text-syntax-keyword hover:underline">
              로그인
            </Link>
          </p>
        </div>

        {/* 에디터로 돌아가기 */}
        <div className="text-center mt-4">
          <Link href="/editor" className="text-editor-fg text-opacity-50 hover:text-opacity-70 text-sm">
            가입 없이 계속하기
          </Link>
        </div>
      </div>
    </div>
  );
}
