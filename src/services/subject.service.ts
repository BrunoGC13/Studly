import pool from "../db/pool.db";
import {AppError} from "../util/app.error";
import logger from "../util/logger";

async function create(data: any) {
    const { name, color } = data.body;
    const userId = data.userId;

    if (!name || !color) {
        throw new AppError("Please provide a name and color!", 400);
    }

    const query = 'INSERT INTO subjects (name, color, owner) VALUES ($1, $2, $3) RETURNING id, name, color';
    try {
        const result = await pool.query(query, [name, color, userId]);
        if (result == null) {
            logger.error(result);
            throw new AppError("Internal Server Error", 500);
        }
        if (result.rows.length == 0 || result.rows.length > 1) {
            logger.error(result);
            throw new AppError("Subject already exists!");
        }

        return result.rows[0];
    } catch (err: any) {
        if (err.code === '23505') {
            throw new AppError("Subject already exists!", 409);
        }

        if (err.code === '23503') {
            throw new AppError("User not found!", 404);
        }

        logger.error(err);
        throw new AppError("Internal Server Error", 500);
    }
}

async function remove(data: any) {
    const { id } = data.body;
    const userId = data.userId;

    if (!id) {
        throw new AppError("No ID provided!", 400);
    }

    const query = `DELETE FROM subjects WHERE id = $1 AND owner = $2 RETURNING id, name, color`;
    try {
        const result = await pool.query(query, [id, userId]);
        if (result.rowCount == 0 || result.rowCount == null) {
            throw new AppError("No matching subject found!")
        }

        return result.rows[0];
    } catch (err) {
        logger.error(err);
        throw new AppError("Internal Server Error", 500);
    }
}

async function edit(data: any) {
    const { id, name, color } = data.body;
    const userId = data.userId;

    if (!id || !name || !color) {
        throw new AppError("No ID, name and color provided!", 400);
    }

    const query = `UPDATE subjects SET name = $1, color = $2 WHERE id = $3 AND owner = $4 RETURNING id, name, color`;
    try {
        const result = await pool.query(query, [name, color, id, userId]);
        if (result.rowCount == 0 || result.rowCount == null) {
            throw new AppError("No matching subject found!")
        }

        return result.rows[0];
    } catch (err) {
        logger.error(err);
        throw new AppError("Internal Server Error", 500);
    }
}

export = {
    create,
    remove,
    edit,
}