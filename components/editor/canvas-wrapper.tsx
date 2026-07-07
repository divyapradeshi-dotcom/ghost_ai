"use client";

import React, { useEffect, useState } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react";
import CanvasFlow from "./canvas-flow";

interface CanvasWrapperProps {
  roomId: string;
}

export default function CanvasWrapper({ roomId }: CanvasWrapperProps) {
  const [authEndpoint] = useState("/api/liveblocks-auth");

  return (
    <LiveblocksProvider authEndpoint={authEndpoint}>
      <RoomProvider id={roomId} initialPresence={{ cursor: null }}>
        <ClientSideSuspense fallback={<div className="p-6 text-center">Connecting…</div>}>
          <div className="w-full h-full">
            <CanvasFlow />
          </div>
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
