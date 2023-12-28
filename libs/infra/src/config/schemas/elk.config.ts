import { z } from 'zod';

import { str } from '../constants';

export const ElkConfigSchema = z.object({
  ELASTIC_SEARCH_NODE: str,
  ELASTIC_SEARCH_USER: str,
  ELASTIC_SEARCH_PASSWORD: str,
});

export type TElkConfig = z.infer<typeof ElkConfigSchema>;
