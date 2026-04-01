"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/editor");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-full bg-dark-primary">
      <div className="text-center">
        <div className="animate-spin w-12 h-12 border-4 border-dark-border border-t-editor-fg rounded-full mx-auto mb-4" />
        <p className="text-editor-fg text-opacity-70">로드 중...</p>
      </div>
    </div>
  );
}
