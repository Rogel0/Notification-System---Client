import { useEffect, useState, useCallback } from "react";
import api from "../utils/api";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  const check = useCallback(() => {
    setLoading(true);
    let finished = false;
    api
      .get("/profile")
      .then(() => {
        finished = true;
        setIsAuthenticated(true);
        setLoading(false);
      })
      .catch((err) => {
        finished = true;
        // Log the error to help debug why auth check failed (CORS, network, 401, etc.)
        // eslint-disable-next-line no-console
        console.error("useAuth: profile check failed:", err);
        // Retry once after a short delay to allow server-set cookies to arrive
        setTimeout(() => {
          api
            .get("/profile")
            .then(() => {
              setIsAuthenticated(true);
            })
            .catch(() => setIsAuthenticated(false))
            .finally(() => setLoading(false));
        }, 250);
      });

    // Safety timeout: if the request hangs (network issues), stop loading after 8s
    setTimeout(() => {
      if (!finished) {
        // eslint-disable-next-line no-console
        console.warn("useAuth: profile check timed out");
        setIsAuthenticated(false);
        setLoading(false);
      }
    }, 8000);
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
    // clear client-side tokens/storage used by fallback
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("session_expired");
    } catch {}
    setIsAuthenticated(false);
  }, []);

  return { isAuthenticated, loading, logout, refresh: check };
}
