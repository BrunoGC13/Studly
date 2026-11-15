import { Request, Response, NextFunction } from 'express';
import { ZodType, ZodError } from 'zod';
import {resConstructor} from "../util/res.constructor";

export const validateRegistration = (schema: ZodType) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            return next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    status: 'fail',
                    // Optional: mapping errors makes them much cleaner to read on the client side
                    errors: error.message,
                });
            }
            return res.status(500).json(resConstructor(true, false, req, 'Internal Server Error', 500));
        }
    };