"use client";

import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { useEditorStore } from "@/store/editorStore";

export interface CollabBarProps {
  sessionId?: string;
}

export const CollabBar: React.FC<CollabBarProps> = ({ sessionId }) => {
  const { isCollaborating, remoteCursors } = useEditorStore();
  const [participantCount, setParticipantCount] = useState(1);

  useEffect(() => {
    setParticipantCount(1 + remoteCursors.size);
  }, [remoteCursors]);

  if (!sessionId || !isCollaborating) {
    return null;
  }

  return (
    <div className="bg-dark-secondary border border-dark-border rounded-lg p-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex items-center">
          <div className="w-2 h-2 bg-state-success rounded-full mr-2 animate-pulse" />
          <span className="text-editor-fg text-sm">협업 중</span>
        </div>

        <div className="border-l border-dark-border" />

        <div className="text-editor-fg text-opacity-70 text-sm">
          세션 ID: <span className="font-mono">{sessionId.substring(0, 8)}...</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Badge variant="info" size="sm">
          👥 {participantCount}명
        </Badge>

        {remoteCursors.size > 0 && (
          <div className="flex items-center gap-2">
            {Array.from(remoteCursors.entries()).slice(0, 3).map(([userId]) => (
              <div
                key={userId}
                className="w-6 h-6 bg-state-info rounded-full flex items-center justify-center text-white text-xs font-bold"
                title={`사용자: ${userId}`}
              >
                👤
              </div>
            ))}
            {remoteCursors.size > 3 && (
              <span className="text-editor-fg text-opacity-50 text-xs">
                +{remoteCursors.size - 3}명
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

CollabBar.displayName = "CollabBar";
