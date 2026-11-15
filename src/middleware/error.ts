import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import logger from "../util/logger";
import { resConstructor } from "../util/res.constructor";
import { AppError } from "../util/app.error";

export const errorHandler = (
    err: unknown,
    req: Request,
    res: Response,
    _next: NextFunction,
) => {
    if (err instanceof ZodError) {
        return res.status(400).json(
            resConstructor(
                req,
                true,
                false,
                "Validation failed",
                400,
                {
                    details: err.issues,
                },
            ),
        );
    }

    if (err instanceof AppError) {
        if (err.statusCode >= 500) {
            logger.error(err);
        } else {
            logger.warn({
                err,
                method: req.method,
                endpoint: req.originalUrl,
            });
        }

        return res.status(err.statusCode).json(
            resConstructor(
                req,
                true,
                false,
                err.message,
                err.statusCode,
                {
                    details: err.details,
                },
            ),
        );
    }

    logger.error({
        err,
        method: req.method,
        endpoint: req.originalUrl,
    });

    return res.status(500).json(
        resConstructor(
            req,
            true,
            false,
            "Internal Server Error",
            500,
        ),
    );
};