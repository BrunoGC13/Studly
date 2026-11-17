import { z } from 'zod';

export const HomeworkCreationSchema = z.object({
    body: z.object({
        subjectId: z.int()
    }),
});

export const HomeworkDeletionSchema = z.object({
    body: z.object({
        homeworkId: z.int()
    }),
});

export const HomeworkEditSchema = z.object({
    body: z.object({
        homeworkId: z.int(),
        subjectId: z.int()
    }),
});