import { z } from 'zod';

import { num, str } from './app.config';

export const RedisConfigSchema = z.object({
  REDIS_URI: str,
  DEFAULT_CACHE_TTL: num.default(10000),
});

export type TRedisConfig = z.infer<typeof RedisConfigSchema>;
