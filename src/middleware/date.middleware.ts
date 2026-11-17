import { Request } from "express";
import { AppError } from "../util/app.error";

export function date(value: unknown, _req: Request): string {
    if (typeof value !== "string") {
        throw new AppError("A due date is required.", 400);
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        throw new AppError("Due date must use YYYY-MM-DD format.", 400);
    }

    const [year, month, day] = value.split("-").map(Number);
    const parsed = new Date(Date.UTC(year, month - 1, day));

    if (
        parsed.getUTCFullYear() !== year ||
        parsed.getUTCMonth() !== month - 1 ||
        parsed.getUTCDate() !== day
    ) {
        throw new AppError("Invalid due date.", 400);
    }

    return value;
}