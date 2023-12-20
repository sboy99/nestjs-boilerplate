import { z } from 'zod';

export const str = z.string();
export const port = z.coerce.number();

export const GlobalConfigSchema = z.object({
  NODE_ENV: z.enum(['production', 'development']),
});

export type TGlobalConfig = z.infer<typeof GlobalConfigSchema>;
