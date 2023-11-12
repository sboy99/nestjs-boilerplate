import { z } from 'zod';

export const str = z.string();
export const port = z.coerce.number();
