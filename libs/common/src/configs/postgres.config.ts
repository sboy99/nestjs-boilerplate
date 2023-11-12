import type { z } from 'zod';

import { GlobalConfig, port, str } from './global.config';

export const PostgresConfig = GlobalConfig.extend({
  POSTGRES_HOST: str,
  POSTGRES_USER: str,
  POSTGRES_PASSWORD: str,
  POSTGRES_DB: str,
  POSTGRES_PORT: port,
});

export type TPostgresConfig = z.infer<typeof PostgresConfig>;
