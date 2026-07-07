"use client";

import { createContext, type ReactNode, useContext, useState } from "react";

interface AIPanelContextValue {
  isAIPanelOpen: boolean;
  toggleAIPanel: () => void;
  setAIPanelOpen: (open: boolean) => void;
}

const AIPanelContext = createContext<AIPanelContextValue | null>(null);

export function AIPanelProvider({ children }: { children: ReactNode }) {
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(true);

  const value: AIPanelContextValue = {
    isAIPanelOpen,
    toggleAIPanel: () => setIsAIPanelOpen((prev) => !prev),
    setAIPanelOpen: setIsAIPanelOpen,
  };

  return (
    <AIPanelContext.Provider value={value}>
      {children}
    </AIPanelContext.Provider>
  );
}

export function useAIPanel() {
  const context = useContext(AIPanelContext);
  if (!context) {
    throw new Error("useAIPanel must be used within AIPanelProvider");
  }
  return context;
}
