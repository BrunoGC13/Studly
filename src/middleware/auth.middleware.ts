import { Request, Response, NextFunction } from "express";
import jwt, {JwtPayload} from 'jsonwebtoken';
import {resConstructor} from "../util/res.constructor";

export interface AuthRequest extends Request {
    userId?: string
}

interface TokenPayload extends JwtPayload {
    userId: string
}

export const authenticateToken = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
        return res.status(401).json(resConstructor(req, true, false, "No token provided!", 401));
    }

    const secret = process.env.JWT_TOKEN;
    if (!secret) {
        return res.status(500).json(resConstructor(req, true, false, "Server configuration error", 500));
    }

    try {
        const decoded = jwt.verify(token, secret) as TokenPayload;
        req.userId = decoded.userId;
        next();
    } catch (err) {
        return res.status(403).json(resConstructor(req, true, false, "Invalid or expired token", 403));
    }
}