import {AppError} from "../util/app.error";
import {Request} from "express";

export interface DateRequest extends Request {
    date?: Date
}

export const date = (stringDate: string, req: DateRequest) => {
    if (!stringDate) throw new AppError("Invalid date!", 400);
    req.date = new Date(stringDate);
    return req;
}