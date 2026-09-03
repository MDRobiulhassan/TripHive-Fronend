import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, { message: 'Name must be at least 2 characters' }),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
