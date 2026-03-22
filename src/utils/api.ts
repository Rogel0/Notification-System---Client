import axios from "axios";

// Choose API base URL robustly:
// - In dev use Vite proxy (`/api`).
// - In production prefer `VITE_API_HOST` if provided, otherwise fall back to the current origin.
const isDev = import.meta.env.DEV;
const envHost = import.meta.env.VITE_API_HOST;
const hostFallback =
  typeof window !== "undefined" ? window.location.origin : "";
const apiHost = isDev ? "" : envHost || hostFallback;
const baseURL = isDev ? "/api" : `${apiHost.replace(/\/$/, "")}/api`;

const api = axios.create({
  baseURL,
  withCredentials: true,
});

// Runtime debug: print resolved base URL so deployed bundle shows what it will call.
// This helps confirm whether `VITE_API_HOST` was injected correctly.
// Remove or silence after verification.
// eslint-disable-next-line no-console
console.log("[app] API baseURL:", baseURL);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 401) {
      const url = error.config?.url || "";
      const isAuthEndpoint =
        url.endsWith("/login") || url.endsWith("/register");

      // Skip auto redirect for login/register failures, only handle expired sessions
      if (!isAuthEndpoint) {
        const currentPath = window.location.pathname;
        if (currentPath !== "/login") {
          try {
            await api.post("/logout");
          } catch {
            // ignore
          }
          localStorage.setItem("session_expired", "true");
          window.location.href = "/login";
        } else {
          localStorage.setItem("session_expired", "true");
        }
      }
    }
    return Promise.reject(error);
  },
);

export default api;
