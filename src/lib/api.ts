import axios from 'axios';

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export const api = axios.create({ baseURL: BASE, headers: { 'Content-Type': 'application/json' } });

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  async (err) => {
    const orig = err.config;
    if (err.response?.status === 401 && !orig._retry) {
      orig._retry = true;
      const rt = typeof window !== 'undefined' && localStorage.getItem('refreshToken');
      if (rt) {
        try {
          const res = await axios.post(`${BASE}/auth/refresh`, { refreshToken: rt });
          localStorage.setItem('accessToken', res.data.accessToken);
          orig.headers.Authorization = `Bearer ${res.data.accessToken}`;
          return api(orig);
        } catch {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          if (typeof window !== 'undefined') window.location.href = '/auth/login';
        }
      }
    }
    return Promise.reject(err);
  }
);
