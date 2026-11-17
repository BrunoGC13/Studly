import pool from "../db/pool.db";
import {AppError} from "../util/app.error";
import logger from "../util/logger";

async function create(data: any) {
    const { subjectId } = data.body;
    const date = data.date;
    const userId= data.userId;

    if (!subjectId || !date) throw new AppError("No data provided!", 400);

    const query = `INSERT INTO homework (owner, subject, dueto) VALUES ($1, $2, $3) RETURNING owner, subject, dueto`;
    try {
        const result = await pool.query(query, [userId, subjectId, date]);
        if (result.rowCount == 0 || result.rowCount == null) throw new AppError("Internal Server Error", 500);

        return result.rows[0];
    } catch (err) {
        logger.error(err);
        throw new AppError("Internal Server Error", 500);
    }
}

async function remove(data: any) {
    const { homeworkId } = data.body;
    const userId = data.userId;
    if (!homeworkId) throw new AppError("No homework id provided!", 400)

    const query = `DELETE FROM homework WHERE id = $1 AND owner = $2 RETURNING id, subject, dueto`;
    try {
        const result = await pool.query(query, [homeworkId, userId]);
        if (result.rowCount == 0 || result.rowCount == null) throw new AppError("No matching homework found!", 400);

        return result.rows[0];
    } catch (err) {
        logger.error(err);
        throw new AppError("Internal Server Error", 500);
    }
}

async function edit(data: any) {
    const { homeworkId, subjectId } = data.body;
    const date = data.date;
    const userId = data.userId;
    if (!homeworkId || !subjectId || !date) throw new AppError("No data provided!", 400)

    const query = `UPDATE homework SET subject = $1, dueto = $2 WHERE id = $3 AND owner = $4 RETURNING id, subject, dueto`;
    try {
        const result = await pool.query(query, [subjectId, date, homeworkId, userId]);
        if (result.rowCount == 0 || result.rowCount == null) throw new AppError("No matching homework found!", 400);

        return result.rows[0];
    } catch (err) {
        logger.error(err);
        throw new AppError("Internal Server Error", 500);
    }
}

async function get(data: any) {
    const userId = data.userId;

    const query = 'SELECT * FROM homework WHERE owner = $1';
    try {
        const result = await pool.query(query, [userId]);
        if (result.rowCount == 0 || result.rowCount == null) throw new AppError("No homework found!", 404);

        return result.rows;
    } catch (err) {
        logger.error(err);
        throw new AppError("Internal Server Error", 500);
    }
}

export = {
    create,
    remove,
    edit,
    get
}