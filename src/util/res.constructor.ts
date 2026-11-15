import { Request } from "express";

type ResponseConstructorOptions = {
    data?: unknown;
    details?: unknown;
};

export const resConstructor = (
    req: Request,
    error: boolean,
    success: boolean,
    msg: string,
    code: number,
    options: ResponseConstructorOptions = {},
) => {
    return {
        success,
        error,
        msg,
        code,
        ...(options.data !== undefined && { data: options.data }),
        ...(options.details !== undefined && { details: options.details }),
        call: {
            method: req.method || "No method provided",
            endpoint: req.originalUrl || "No endpoint provided",
        },
        time: new Date().toISOString(),
    };
};