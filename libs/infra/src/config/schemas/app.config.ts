import type { z } from 'zod';

import { GlobalConfigSchema } from './global.config';
import { MongoConfigSchema } from './mongo.config';

export const AppConfigSchema = GlobalConfigSchema.and(MongoConfigSchema);

export type TAppConfig = z.infer<typeof AppConfigSchema>;
