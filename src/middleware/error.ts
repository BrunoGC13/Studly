import {Request, Response, NextFunction} from "express";
import logger from "../util/logger";
import {resConstructor} from "../util/res.constructor";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(err);
    res.status(500).json(resConstructor(true, false, req, err.message, 500));
}