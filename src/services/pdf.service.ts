import pool from "../db/pool.db";
import {AppError} from "../util/app.error";
import logger from "../util/logger";

async function upload(data: any) {
    const file = data.file;
    const userId = data.userId;
    if (!file) throw new AppError("No file uploaded!", 400);

    const query = 'INSERT INTO worksheets (name, data, owner) VALUES ($1, $2, $3) RETURNING id';
    try {
        const result = await pool.query(query, [file.originalname, file.buffer, userId]);
        if (result.rowCount == 0 || result.rowCount == null) throw new AppError("Internal Server Error", 500);

        return result.rows[0];
    } catch (err) {
        logger.error(err);
        throw new AppError("Internal Server Error", 500);
    }
}

async function retrieve(data: any) {
    const {id} = data.body;
    const userId = data.userId;
    if (!id) throw new AppError("No ID provided!", 400);

    const query = 'SELECT data FROM worksheets WHERE id = $1 AND owner = $2';
    try {
        const result = await pool.query(query, [id, userId]);
        if (result.rowCount == 0 || result.rowCount == null) throw new AppError("Internal Server Error", 500);

        return result.rows[0];
    } catch (err) {
        logger.error(err);
        throw new AppError("Internal Server Error", 500);
    }
}

export = {
    upload,
    retrieve
}