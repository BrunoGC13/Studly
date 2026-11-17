import pool from "../db/pool.db";
import {AppError} from "../util/app.error";
import SecurityService from './security.service'
import {IUser} from "../types/user.types";
import jwt, {JwtPayload} from "jsonwebtoken";
import {EmailService} from "./email.service";
import crypto from 'crypto';
import logger from "../util/logger";

interface TokenPayload extends JwtPayload {
    username: string
}

async function register(data: any) {
    const { name, email, password } = data;

    if (!name || !email || !password) {
        throw new AppError(
            "Please provide a name, email and password!",
            400,
        );
    }
    const secret = process.env.JWT_TOKEN;
    if (!secret) {
        logger.error(`No JWT access token found!`)
        throw new AppError("Internal Server Error", 500);
    }

    if (await getUserByName(name) != null) {
        throw new AppError("User already exists", 409);
    }

    const hashedPassword = await SecurityService.hashPassword(password);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenHash = crypto
        .createHash("sha256")
        .update(verificationToken)
        .digest("hex");

    const query = `
        INSERT INTO users (name, email, password, createdat, updatedat, verificationtoken)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
    `;

    try {
        const createdAt = new Date(Date.now() + 60 * 60 * 1000);
        const result = await pool.query<IUser>(query, [
            name,
            email,
            hashedPassword,
            createdAt,
            createdAt,
            verificationToken
        ]);

        const user = result.rows[0];

        if (!user) {
            throw new AppError(
                "User could not be created",
                500,
            );
        }

        await EmailService.sendVerificationMail(user, verificationToken);


    } catch (error: any) {
        throw error;
    }
}

async function login(data: any) {
    const { name, password } = data;
    if (!name || !password) {
        throw new AppError("Please provide a name and password!", 400);
    }
    const secret = process.env.JWT_TOKEN;
    const expires = process.env.JWT_EXPIRES;
    if (!secret || !expires) {
        logger.error(`No JWT access token or expire time found!`)
        throw new AppError("Internal Server Error", 500)
    }

    const user: IUser | null = await getUserByName(name);
    if (user == null) {
        throw new AppError("No user found!", 400);
    }

    if (!user.isverified) throw new AppError("User needs email authorization!", 401);

    const match: boolean = await SecurityService.comparePassword(password, user.password);
    if (!match) {
        throw new AppError("Invalid credentials!", 401)
    }

    // @ts-ignore
    const token = jwt.sign({ userId: user.id }, secret, {
        expiresIn: expires
    });

    return {token};
}

async function getUserById(id: number): Promise<IUser | null> {
    if (!Number.isInteger(id) || id <= 0) {
        throw new AppError("A valid ID is required!", 400);
    }

    const query = `SELECT * FROM users WHERE id = $1`;

    const result = await pool.query<IUser>(query, [id]);
    return result.rows[0] ?? null;
}

async function getUserByName(name: string): Promise<IUser | null> {
    if (!name) {
        throw new AppError("No name provided!", 400);
    }

    const query = `SELECT * FROM users WHERE name = $1`;

    const result = await pool.query<IUser>(query, [name]);
    return result.rows[0] ?? null;
}

async function verifyMail(token: string) {
    if (!token) {
        throw new AppError("No token provided for verification!", 400);
    }

    const query = `UPDATE users SET isverified = $1, verificationtoken = NULL WHERE verificationtoken = $2 AND isverified = FALSE`;

    try {
        const result = await pool.query(query, [true, token])
    } catch (err) {
        throw new AppError("Invalid or expired token!", 403)
    }
}

export = {
    register,
    login,
    verifyMail,
    getUserByName,
    getUserById
}