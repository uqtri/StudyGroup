import { z } from 'zod';

export const groupSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().optional(),
  subject: z.string().min(1, 'Subject is required'),
  maxMembers: z.coerce.number().min(2).max(100).default(20),
});
