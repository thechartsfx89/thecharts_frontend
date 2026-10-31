// context/LoaderContext.tsx
"use client"
import { createContext, useContext, useState, ReactNode } from "react";

type LoaderContextType = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

const LoaderContext = createContext<LoaderContextType | null>(null);

export const LoaderProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);

  return (
    <LoaderContext.Provider value={{ loading, setLoading }}>
      {children}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-white/50">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => {
  const ctx = useContext(LoaderContext);
  if (!ctx) throw new Error("useLoader must be used inside LoaderProvider");
  return ctx;
};
