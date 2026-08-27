'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { UserProfileResponseDto, LoginRequest, SignUpRequest, LoginResponse } from '@/types/api';

interface AuthContextType {
  user: UserProfileResponseDto | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (c: LoginRequest) => Promise<void>;
  signup: (u: SignUpRequest) => Promise<void>;
  logout: () => void;
  refreshUserProfile: () => Promise<void>;
}

const Ctx = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfileResponseDto | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await api.get<UserProfileResponseDto>('/user/me');
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('accessToken')) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials: LoginRequest) => {
    const res = await api.post<LoginResponse>('/auth/login', credentials);
    localStorage.setItem('accessToken', res.data.accessToken);
    localStorage.setItem('refreshToken', res.data.refreshToken);
    await fetchProfile();
  };

  const signup = async (data: SignUpRequest) => {
    await api.post('/auth/signup', data);
    await login({ email: data.email, password: data.password });
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  return (
    <Ctx.Provider value={{ user, isLoggedIn: !!user, loading, login, signup, logout, refreshUserProfile: fetchProfile }}>
      {children}
    </Ctx.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
