'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { HotelSearchRequest, HotelSearchPage, HotelInfoResponseDTO } from '@/types/api';

function getDefaultDates(): { checkInDate: string; checkOutDate: string } {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const fmt = (d: Date): string => d.toISOString().split('T')[0];
  return { checkInDate: fmt(today), checkOutDate: fmt(tomorrow) };
}

function buildSearchBody(params: HotelSearchRequest): HotelSearchRequest {
  const defaults = getDefaultDates();
  return {
    city: params.city || undefined,
    checkInDate: params.checkInDate || defaults.checkInDate,
    checkOutDate: params.checkOutDate || defaults.checkOutDate,
    numberOfRooms: params.numberOfRooms != null ? params.numberOfRooms : 1,
    page: params.page != null ? params.page : 0,
    size: params.size != null ? params.size : 12,
  };
}

export function useHotelSearch(params: HotelSearchRequest | null) {
  return useQuery<HotelSearchPage, Error>({
    queryKey: ['hotels', 'search', params],
    queryFn: async () => {
      const body = buildSearchBody(params || {});
      const res = await api.post('/hotels/search', body);
      return res.data;
    },
    enabled: true,
    staleTime: 1000 * 30,
  });
}

export function useHotelSearchMutation() {
  return useMutation<HotelSearchPage, Error, HotelSearchRequest>({
    mutationFn: async (params: HotelSearchRequest) => {
      const body = buildSearchBody(params);
      const res = await api.post('/hotels/search', body);
      return res.data;
    },
  });
}

export function useHotelInfo(hotelId: number | null) {
  return useQuery({
    queryKey: ['hotel', 'info', hotelId],
    queryFn: async () => {
      const res = await api.get(`/hotels/${hotelId}/info`);
      return res.data;
    },
    enabled: !!hotelId,
    staleTime: 1000 * 60,
  });
}
