export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export interface SignUpRequest { name: string; email: string; password: string; }
export interface LoginRequest { email: string; password: string; }
export interface LoginResponse { id: number; accessToken: string; refreshToken: string; }
export interface UserProfileResponseDto { id: number; name: string; email: string; roles: string[]; }

export interface ContactInfo { address: string; phoneNumbers?: string[]; emails?: string[]; }

export interface HotelResponseDTO {
  id: number; name: string; city: string;
  photos: string[]; amenities: string[];
  contactInfo: ContactInfo; active: boolean;
}

export interface RoomResponseDTO {
  id: number; type: string; basePrice: number;
  photos: string[]; amenities: string[];
  capacity: number; totalCount: number;
}

export interface HotelSearchRequest {
  city?: string; checkInDate?: string; checkOutDate?: string;
  roomsCount?: number; page?: number; size?: number;
}

export interface HotelPriceDTO { hotel: HotelResponseDTO; price: number; }
export interface HotelInfoResponseDTO { hotel: HotelResponseDTO; rooms: RoomResponseDTO[]; }

export interface BookingRequestDTO {
  hotelId: number; roomId: number;
  checkInDate: string; checkOutDate: string; roomsCount: number;
}

export interface GuestDTO { id?: number; name: string; age: number; gender: Gender; }

export interface BookingResponseDTO {
  id: number; numberOfRooms: number; createdAt: string;
  bookingStatus: BookingStatus; checkInDate: string; checkOutDate: string;
  amount: number; guests: GuestDTO[]; hotel?: HotelResponseDTO;
}

export interface HotelReportResponse {
  totalBookings: number; totalRevenue: number; averageRevenue: number;
}
