import axios from ''axios'';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''http://localhost:8080'';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    ''Content-Type'': ''application/json'',
  },
});

// Request Interceptor: Attach JWT Access Token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== ''undefined'') {
      const token = localStorage.getItem(''accessToken'');
      if (token) {
        config.headers.Authorization = Bearer ;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Token Refresh on 401
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = Bearer ;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = typeof window !== ''undefined'' ? localStorage.getItem(''refreshToken'') : null;

      if (!refreshToken) {
        isRefreshing = false;
        if (typeof window !== ''undefined'') {
          localStorage.removeItem(''accessToken'');
          localStorage.removeItem(''refreshToken'');
        }
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(${API_BASE_URL}/auth/refresh?refreshToken=);
        const newAccessToken = data.accessToken;

        if (typeof window !== ''undefined'') {
          localStorage.setItem(''accessToken'', newAccessToken);
          if (data.refreshToken) {
            localStorage.setItem(''refreshToken'', data.refreshToken);
          }
        }

        api.defaults.headers.common.Authorization = Bearer ;
        originalRequest.headers.Authorization = Bearer ;

        processQueue(null, newAccessToken);
        return api(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        if (typeof window !== ''undefined'') {
          localStorage.removeItem(''accessToken'');
          localStorage.removeItem(''refreshToken'');
          window.dispatchEvent(new Event(''auth:logout''));
        }
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
