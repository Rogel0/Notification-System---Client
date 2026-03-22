import { useEffect, useState, useCallback } from "react";
import api from "../utils/api";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  const check = useCallback(() => {
    setLoading(true);
    api
      .get("/profile")
      .then(() => {
        setIsAuthenticated(true);
        setLoading(false);
      })
      .catch(() => {
        setIsAuthenticated(false);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    check();
  }, [check]);

  const logout = useCallback(async () => {
    try {
      await api.post("/logout");
    } catch (err) {
      // ignore
    }
    setIsAuthenticated(false);
  }, []);

  return { isAuthenticated, loading, logout, refresh: check };
}
