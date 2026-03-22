import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

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
            await axios.post(
              "http://localhost:3000/api/logout",
              {},
              { withCredentials: true },
            );
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
