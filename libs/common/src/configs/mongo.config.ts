import { z } from 'zod';

import { str } from './global.config';

export const MongoConfigSchema = z.object({
  MONGO_URI: str,
});

export type TMongoConfig = z.infer<typeof MongoConfigSchema>;
