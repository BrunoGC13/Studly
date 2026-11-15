import {Request} from "express";

export const resConstructor = (error: boolean, success: boolean, req: Request, msg: String, code: Number) => {
    return {
        success: success || false,
        error: error || true,
        msg: msg || "No message provided!",
        code: code || 500,
        call: {
            method: req.method || "No data provided",
            endpoint: req.originalUrl || "No data provided"
        },
        time: new Date().toISOString()
    }
}