'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { UserProfileResponseDto, UpdateProfileRequest, BookingResponseDTO } from '@/types/api';

// 1. GET /user/me
export function useUserProfileQuery() {
  const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('accessToken');

  return useQuery<UserProfileResponseDto, Error>({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const res = await api.get<UserProfileResponseDto>('/user/me');
      return res.data;
    },
    enabled: hasToken,
    retry: false,
  });
}

// 2. PUT /user/profile
export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation<UserProfileResponseDto, Error, UpdateProfileRequest>({
    mutationFn: async (data: UpdateProfileRequest) => {
      const res = await api.put<UserProfileResponseDto>('/user/profile', data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['userProfile'], data);
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
}

// 3. GET /user/myBookings
export function useUserBookingsQuery() {
  const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('accessToken');

  return useQuery<BookingResponseDTO[], Error>({
    queryKey: ['userBookings'],
    queryFn: async () => {
      const res = await api.get<BookingResponseDTO[]>('/user/myBookings');
      return res.data;
    },
    enabled: hasToken,
    staleTime: 1000 * 60, // 1 minute
  });
}
