import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // BẮT BUỘC để gửi cookie
});

// Response interceptor

let refreshing = false;
let queue: {
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}[] = [];

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    // Không refresh cho login / refresh
    if (
      original.url?.includes("/auth/login") ||
      original.url?.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    // Chỉ xử lý 401 và chưa retry
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      // Nếu đang refresh -> chờ
      if (refreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject });
        }).then(() => api(original));
      }

      refreshing = true;

      try {
        // Cookie refreshToken sẽ tự gửi
        await api.post("/auth/refresh");

        queue.forEach((p) => p.resolve());
        queue = [];
        refreshing = false;

        // Retry request cũ
        return api(original);
      } catch (err) {
        refreshing = false;
        queue.forEach((p) => p.reject(err));
        queue = [];

        // Logout -> backend xóa cookie
        await api.post("/auth/logout").catch(() => { });

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
