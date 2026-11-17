import { z } from 'zod';

export const SubjectCreationSchema = z.object({
    body: z.object({
        name: z.string().trim().min(4, "Subject name too short"),
        color: z.string()
    }),
});

export const SubjectRemoveSchema = z.object({
    body: z.object({
        id: z.int()
    }),
});