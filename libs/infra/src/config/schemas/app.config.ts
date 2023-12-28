import { z } from 'zod';

import { port } from '../constants';
import { ElkConfigSchema } from './elk.config';
import { MongoConfigSchema } from './mongo.config';
import { NodeConfigSchema } from './node.config';
import { RedisConfigSchema } from './redis.config';

export const AppConfigSchema = z
  .object({
    APP_HTTP_PORT: port.default(3000),
  })
  .and(NodeConfigSchema)
  .and(MongoConfigSchema)
  .and(RedisConfigSchema)
  .and(ElkConfigSchema);

export type TAppConfig = z.infer<typeof AppConfigSchema>;
