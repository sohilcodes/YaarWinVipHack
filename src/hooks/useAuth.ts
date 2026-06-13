"use client";

import { useState, useEffect, useCallback } from "react";

const PASSWORD      = "SohilKhan21";
const STORAGE_KEY   = "yaarwin_auth";
const SESSION_TTL   = 24 * 60 * 60 * 1000; // 24 hours

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading,       setIsLoading]       = useState(true);
  const [error,           setError]           = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const session = JSON.parse(raw) as { loginTime: number };
        if (Date.now() - session.loginTime < SESSION_TTL) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback((password: string): boolean => {
    if (password === PASSWORD) {
      const session = { loginTime: Date.now() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      setIsAuthenticated(true);
      setError("");
      return true;
    } else {
      setError("Access Denied");
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setIsAuthenticated(false);
  }, []);

  const clearError = useCallback(() => setError(""), []);

  return { isAuthenticated, isLoading, error, login, logout, clearError };
}
