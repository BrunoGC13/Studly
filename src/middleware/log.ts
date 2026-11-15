import logger from '../util/logger';
import { Request, Response, NextFunction } from 'express';

const apiLog = (req: Request, res: Response, next: NextFunction) => {
    logger.info(`[${req.method}] ${req.originalUrl}`);
    next();
}

export default apiLog;