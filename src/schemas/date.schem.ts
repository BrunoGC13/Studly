import { z } from 'zod';

export const DateFromStringDate = z.object({
    body: z.object({
        date: z.string()
    }),
});