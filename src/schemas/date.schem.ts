import { z } from "zod";

const dateOnly = z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must use YYYY-MM-DD format")
    .refine((value) => {
        const [year, month, day] = value.split("-").map(Number);
        const date = new Date(Date.UTC(year, month - 1, day));

        return (
            date.getUTCFullYear() === year &&
            date.getUTCMonth() === month - 1 &&
            date.getUTCDate() === day
        );
    }, "Invalid calendar date");

export const DateFromStringDate = z.object({
    body: z.object({
        date: dateOnly
    })
});