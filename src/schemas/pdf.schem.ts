import { z } from 'zod';

export const WorksheetUploadSchema = z.object({
    body: z.object({
        file: z.file()
    }),
});

export const RetrieveWorksheetSchema = z.object({
    body: z.object({
        id: z.int()
    }),
});