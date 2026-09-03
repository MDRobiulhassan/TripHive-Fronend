'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { SignUpRequest, SignUpResponse, LoginRequest, LoginResponse, UserProfileResponseDto } from '@/types/api';

// 1. Signup Mutation: POST /auth/signup
export function useSignupMutation() {
  return useMutation<SignUpResponse, Error, SignUpRequest>({
    mutationFn: async (data: SignUpRequest) => {
      const res = await api.post<SignUpResponse>('/auth/signup', data);
      return res.data;
    },
  });
}

// 2. Login Mutation: POST /auth/login
export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: async (credentials: LoginRequest) => {
      const res = await api.post<LoginResponse>('/auth/login', credentials);
      return res.data;
    },
    onSuccess: (data) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
      }
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
}

// 3. User Profile Query: GET /user/me
export function useUserProfileQuery() {
  const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('accessToken');

  return useQuery<UserProfileResponseDto, Error>({
    queryKey: ['userProfile'],
    queryFn: async () => {
      try {
        const res = await api.get<UserProfileResponseDto>('/user/me');
        return res.data;
      } catch (err) {
        // Clear tokens on 401/403 profile error without triggering page reload
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
        throw err;
      }
    },
    enabled: hasToken,
    retry: false,
  });
}
