import { z } from 'zod';

export const hotelSearchSchema = z.object({
  city: z.string().optional(),
  checkInDate: z.string().optional(),
  checkOutDate: z.string().optional(),
  numberOfRooms: z.number().min(1).optional(),
  page: z.number().optional(),
  size: z.number().optional(),
});

export type HotelSearchInput = z.infer<typeof hotelSearchSchema>;
