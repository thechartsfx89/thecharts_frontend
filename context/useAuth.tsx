// hooks/useAuth.ts
import { useEffect, useState, useCallback } from "react";
import axios from "axios";

type User = {
  id: number;
  username: string;
  role: string;
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("/api/auth/me", { withCredentials: true });
        setUser(res.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Login
  const login = useCallback(async (identifier: string, password: string) => {
    const res = await axios.post(
      "/api/auth/login",
      { identifier, password },
      { withCredentials: true }
    );
    setUser(res.data.user);
  }, []);

  // Logout
  const logout = useCallback(async () => {
    await axios.post("/api/auth/logout", {}, { withCredentials: true });
    setUser(null);
  }, []);

  // Refresh access token
  const refresh = useCallback(async () => {
    try {
      const res = await axios.post("/api/auth/refresh", {}, { withCredentials: true });
      setUser(res.data.user);
    } catch {
      setUser(null);
    }
  }, []);

  return { user, loading, login, logout, refresh };
}
