import { z } from 'zod';

export const str = z.string();
export const port = z.coerce.number();
export const bool = z.coerce.boolean();

export const GlobalConfig = z.object({
  NODE_ENV: z.enum(['production', 'development']),
});
