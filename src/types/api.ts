export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export type BookingStatus = 'CONFIRMED' | 'CANCELLED' | 'PENDING' | 'EXPIRED';

export type PaymentStatus = 'PENDING' | 'CONFIRMED' | 'REFUNDED' | 'FAILED';

export interface SignUpRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
}

export interface ProfileUpdateRequestDto {
  name?: string;
  dateOfBirth?: string;
  gender?: Gender;
}

export interface UserProfileResponseDto {
  id: number;
  name: string;
  dateOfBirth?: string;
  gender?: Gender;
  email: string;
}

export interface HotelContactInfo {
  address?: string;
  phoneNumber?: string;
  email?: string;
  location?: string;
}

export interface HotelDTO {
  name: string;
  city: string;
  photos: string[];
  amenities: string[];
  contactInfo: HotelContactInfo;
  active?: boolean;
}

export interface HotelResponseDTO {
  id: number;
  name: string;
  city: string;
  photos: string[];
  createdAt?: string;
  updatedAt?: string;
  amenities: string[];
  active: boolean;
  contactInfo: HotelContactInfo;
}

export interface RoomDTO {
  type: string;
  basePrice: number;
  amenities: string[];
  photos: string[];
  totalCount: number;
  capacity: number;
}

export interface RoomResponseDTO {
  id: number;
  type: string;
  basePrice: number;
  createdAt?: string;
  updatedAt?: string;
  amenities: string[];
  photos: string[];
  totalCount: number;
  capacity: number;
}

export interface HotelInfoResponseDTO {
  hotel: HotelResponseDTO;
  rooms: RoomResponseDTO[];
}

export interface HotelPriceDTO {
  hotel: HotelResponseDTO;
  price: number;
}

export interface HotelSearchRequest {
  city?: string;
  checkInDate?: string;
  checkOutDate?: string;
  numberOfRooms?: number;
  page?: number;
  size?: number;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface BookingRequestDTO {
  hotelId: number;
  roomId: number;
  numberOfRooms: number;
  checkInDate: string;
  checkOutDate: string;
}

export interface GuestDTO {
  name: string;
  age: number;
  gender: Gender;
}

export interface GuestResponseDTO {
  id: number;
  name: string;
  age: number;
  gender: Gender;
}

export interface BookingResponseDTO {
  id: number;
  numberOfRooms: number;
  createdAt?: string;
  updatedAt?: string;
  bookingStatus: BookingStatus;
  checkInDate: string;
  checkOutDate: string;
  guests: GuestResponseDTO[];
  amount: number;
  hotel?: HotelResponseDTO;
}

export interface UpdateInventoryRequestDto {
  startDate: string;
  endDate: string;
  surgeFactor: number;
  closed: boolean;
}

export interface InventoryResponse {
  id: number;
  date: string;
  bookedCount: number;
  reservedCount: number;
  totalCount: number;
  surgeFactor: number;
  price: number;
  closed: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface HotelReportResponse {
  bookingCount: number;
  totalRevenue: number;
  averageRevenue: number;
}
