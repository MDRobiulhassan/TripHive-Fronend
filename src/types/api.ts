export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type BookingStatus = 'RESERVED' | 'PAYMENT_PENDING' | 'CONFIRMED' | 'CANCELLED' | 'GUESTS_ADDED';

// ─── Auth ────────────────────────────────────────────────────────────────────
export interface SignUpRequest {
  email: string;
  password: string;
  name: string;
}
export interface SignUpResponse {
  id: number;
  email: string;
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
}

// ─── User ────────────────────────────────────────────────────────────────────
export interface UserProfileResponseDto {
  id: number;
  name: string;
  email: string;
  dateOfBirth?: string | null;
  gender?: Gender | null;
  roles?: string[];
}
export interface UpdateProfileRequest {
  name?: string;
  dateOfBirth?: string;
  gender?: Gender;
}

// ─── Hotel ───────────────────────────────────────────────────────────────────
export interface ContactInfo {
  address: string;
  phoneNumber?: string;
  email?: string;
  location?: string;
  phoneNumbers?: string[];
  emails?: string[];
}
export interface HotelResponseDTO {
  id: number;
  name: string;
  city: string;
  photos: string[];
  amenities: string[];
  contactInfo: ContactInfo;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}
export interface RoomResponseDTO {
  id: number;
  type: string;
  basePrice: number;
  photos: string[];
  amenities: string[];
  capacity: number;
  totalCount: number;
}

// Search request — field names match Swagger: numberOfRooms (not roomsCount)
export interface HotelSearchRequest {
  city?: string;
  checkInDate?: string;
  checkOutDate?: string;
  numberOfRooms?: number;
  page?: number;
  size?: number;
}

// Search response — paginated
export interface HotelPriceDTO {
  hotel: HotelResponseDTO;
  price: number;
}
export interface HotelSearchPage {
  content: HotelPriceDTO[];
  totalElements: number;
  totalPages: number;
  number: number;   // current page (0-indexed)
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// Hotel detail
export interface HotelInfoResponseDTO {
  hotel: HotelResponseDTO;
  rooms: RoomResponseDTO[];
}

// ─── Bookings ────────────────────────────────────────────────────────────────
export interface BookingRequestDTO {
  hotelId: number;
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  roomsCount: number;
}
export interface GuestDTO {
  id?: number;
  name: string;
  age: number;
  gender: Gender;
}
export interface BookingResponseDTO {
  id: number;
  amount: number;
  bookingStatus: BookingStatus;
  checkInDate: string;
  checkOutDate: string;
  createdAt: string;
  updatedAt?: string;
  numberOfRooms?: number | null;
  guests?: GuestDTO[];
  hotel?: HotelResponseDTO;
}
export interface HotelReportResponse {
  totalBookings: number;
  totalRevenue: number;
  averageRevenue: number;
}
