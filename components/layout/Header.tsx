"use client";

import React, { useCallback, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/Toast";

export interface HeaderProps {
  onMenuToggle?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const { success } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      success("✓ 로그아웃되었습니다");
    } catch (err) {
      console.error("로그아웃 실패:", err);
    }
  }, [logout, success]);

  return (
    <header className="bg-dark-primary border-b border-dark-border sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* 로고 */}
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-editor-fg to-syntax-function rounded-lg flex items-center justify-center">
            <span className="text-editor-bg font-bold text-sm">F</span>
          </div>
          <span className="font-bold text-editor-fg hidden sm:inline">
            FreeLang
          </span>
        </Link>

        {/* 네비게이션 */}
        <nav className="flex items-center gap-4">
          <Link
            href="/snippets"
            className="text-editor-fg text-opacity-70 hover:text-opacity-100 transition-all text-sm"
          >
            스니펫
          </Link>
          <Link
            href="/editor"
            className="text-editor-fg text-opacity-70 hover:text-opacity-100 transition-all text-sm"
          >
            에디터
          </Link>
        </nav>

        {/* 인증 버튼 */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <span className="text-editor-fg text-sm hidden sm:inline">
                {user.username}
              </span>
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="w-8 h-8 bg-dark-secondary border border-dark-border rounded-full flex items-center justify-center hover:bg-dark-tertiary transition-colors text-editor-fg"
                >
                  ▼
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-dark-secondary border border-dark-border rounded-lg shadow-lg overflow-hidden">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-editor-fg text-sm hover:bg-dark-tertiary transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      프로필
                    </Link>
                    <Link
                      href="/snippets"
                      className="block px-4 py-2 text-editor-fg text-sm hover:bg-dark-tertiary transition-colors border-t border-dark-border"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      내 스니펫
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-state-error text-sm hover:bg-dark-tertiary transition-colors border-t border-dark-border"
                    >
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  로그인
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">
                  가입
                </Button>
              </Link>
            </div>
          )}

          {onMenuToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuToggle}
              className="sm:hidden"
            >
              ☰
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

Header.displayName = "Header";
