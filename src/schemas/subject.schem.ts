import { z } from 'zod';

export const SubjectCreationSchema = z.object({
    body: z.object({
        name: z.string().trim(),
        color: z.string()
    }),
});

export const SubjectEditSchema = z.object({
    body: z.object({
        name: z.string().trim(),
        color: z.string(),
        id: z.int()
    }),
});

export const SubjectRemoveSchema = z.object({
    body: z.object({
        id: z.int()
    }),
});