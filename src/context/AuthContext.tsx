'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { UserProfileResponseDto, LoginRequest, SignUpRequest, LoginResponse, SignUpResponse } from '@/types/api';

interface AuthResponse {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  user: UserProfileResponseDto | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<AuthResponse>;
  signup: (userData: SignUpRequest) => Promise<AuthResponse>;
  logout: () => void;
  fetchProfile: () => Promise<UserProfileResponseDto | null>;
  refreshUserProfile: () => Promise<UserProfileResponseDto | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfileResponseDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProfile = async (): Promise<UserProfileResponseDto | null> => {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setUser(null);
      setLoading(false);
      return null;
    }

    try {
      const res = await api.get<UserProfileResponseDto>('/user/me');
      setUser(res.data);
      return res.data;
    } catch (err) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
    setUser(null);

    try {
      const res = await api.post<LoginResponse>('/auth/login', credentials);
      const { accessToken, refreshToken } = res.data;

      if (!accessToken) {
        return { success: false, error: 'No access token returned from server' };
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', accessToken);
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
      }

      const profile = await fetchProfile();
      if (!profile) {
        return { success: false, error: 'Failed to load user profile' };
      }

      return { success: true };
    } catch (err: any) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
      setUser(null);

      let errMsg = 'Invalid email or password. Please try again.';
      if (err.response?.data?.error?.message) {
        errMsg = err.response.data.error.message;
      } else if (err.response?.data?.message) {
        errMsg = err.response.data.message;
      } else if (err.message === 'Network Error' || !err.response) {
        errMsg = 'Unable to connect to backend server.';
      }

      return { success: false, error: errMsg };
    }
  };

  const signup = async (userData: SignUpRequest): Promise<AuthResponse> => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
    setUser(null);

    try {
      await api.post<SignUpResponse>('/auth/signup', userData);
      return await login({ email: userData.email, password: userData.password });
    } catch (err: any) {
      let errMsg = 'Registration failed. Please try again.';
      if (err.response?.data?.error?.message) {
        errMsg = err.response.data.error.message;
      } else if (err.response?.data?.message) {
        errMsg = err.response.data.message;
      }
      return { success: false, error: errMsg };
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        loading,
        login,
        signup,
        logout,
        fetchProfile,
        refreshUserProfile: fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
