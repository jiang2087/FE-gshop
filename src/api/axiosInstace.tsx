import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // BẮT BUỘC để gửi cookie
});

// Response interceptor

let refreshingPromise: Promise<void> | null = null;

let queue: Array<{
  resolve: () => void;
  reject: (err: any) => void;
}> = [];

const processQueue = (error: any | null) => {
  queue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve();
  });
  queue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const originalUrl = original?.url ?? "";

    if (!original) {
      return Promise.reject(error);
    }

    if (
      originalUrl.includes("/auth/login") ||
      originalUrl.includes("/auth/refresh") ||
      originalUrl.includes("/auth/logout")
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      // 🔥 WAIT if already refreshing
      if (refreshingPromise) {
        return new Promise((resolve, reject) => {
          queue.push({
            resolve: () => resolve(api(original)),
            reject,
          });
        });
      }

      refreshingPromise = api
        .post("/auth/refresh")
        .then(() => {
          processQueue(null);
        })
        .catch((err) => {
          processQueue(err);
          return Promise.reject(err);
        })
        .finally(() => {
          refreshingPromise = null;
        });

      try {
        await refreshingPromise;
        return api(original);
      } catch (err) {
        await api.post("/auth/logout").catch(() => {});

        if (typeof window !== "undefined") {
          window.location.href = "/signin";
        }

        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);
export default api;
