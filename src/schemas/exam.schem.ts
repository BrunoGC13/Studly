import { z } from 'zod';

export const ExamCreationSchem = z.object({
    body: z.object({
        name: z.string().trim(),
        subjetc: z.int()
    }),
});

export const ExamRemovalScheme = z.object({
    body: z.object({
        examId: z.int()
    }),
});

export const ExamEditSchema = z.object({
    body: z.object({
        examId: z.int(),
        name: z.string()
    }),
});