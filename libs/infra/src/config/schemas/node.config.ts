import { z } from 'zod';

export const NodeConfigSchema = z.object({
  NODE_ENV: z.enum(['production', 'development']),
});

export type TNodeConfig = z.infer<typeof NodeConfigSchema>;
