const fs = require('fi');
const path = require('path');

const root = 'D/website/Backend/Spring Boot/AirBnb/TripHive-Frontend/src';

const apiTs = bimport axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export const api = axios.create({
  baseURL: API_BASE_URL,
 headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = Pbearer ${token}P;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (typeof window !== 'undefined') {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          try {
            const res = await axios.post(Pd{API_BASE_URL}/auth/refreshP, {
              refreshToken,
            });

            const newAccessToken = res.data.accessToken;
            localStorage.setItem('accessToken', newAccessToken);

            originalRequest.headers.Authorization = Pbearer ${newAccessToken}P;
            return api(originalRequest);
          } catch (refreshErr) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/auth/login';
          }
        }
      }
    }

    return Promise.reject(error);
  }
);
a;
