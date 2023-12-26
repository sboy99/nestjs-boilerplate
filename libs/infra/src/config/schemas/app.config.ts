import { z } from 'zod';

export const str = z.string();
export const port = z.coerce.number();
export const num = z.coerce.number();

import { MongoConfigSchema } from './mongo.config';
import { NodeConfigSchema } from './node.config';
import { RedisConfigSchema } from './redis.config';

export const AppConfigSchema = z
  .object({
    APP_HTTP_PORT: port.default(3000),
  })
  .and(NodeConfigSchema)
  .and(MongoConfigSchema)
  .and(RedisConfigSchema);

export type TAppConfig = z.infer<typeof AppConfigSchema>;
