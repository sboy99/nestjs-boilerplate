import { z } from 'zod';

import { str } from '../constants';

export const MongoConfigSchema = z.object({
  MONGO_URI: str,
});

export type TMongoConfig = z.infer<typeof MongoConfigSchema>;
