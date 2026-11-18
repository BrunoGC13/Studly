import pool from "../db/pool.db";
import {AppError} from "../util/app.error";
import logger from "../util/logger";

async function create(data: any) {
    const { subjectId, name } = data.body;
    const date = data.date;
    const userId = data.userId;

    if (!subjectId || !name || !date) throw new AppError("No data provided!", 400);

    const query = `INSERT INTO exams (name, owner, subject, date) VALUES ($1, $2, $3, $4) RETURNING name, subject, date`;
    try {
        const result = await pool.query(query, [name, userId, subjectId, date]);
        if (result.rowCount == 0 || result.rowCount == null) throw new AppError("Could not create exam!", 404);

        return result.rows[0];
    } catch (err) {
        logger.error(err);
        throw new AppError("Internal Server Error", 500);
    }
}

async function remove(data: any) {
    const { examId } = data.body;
    const userId = data.userId;
    if (!examId) throw new AppError("No data provided!", 400);

    const query = `DELETE FROM exams WHERE id = $1 AND owner = $2`;
    try {
        const result = await pool.query(query, [examId, userId]);
        if (result.rowCount == 0 || result.rowCount == null) throw new AppError("Could not remove exam!", 404);

        return result.rows[0];
    } catch (err) {
        logger.error(err);
        throw new AppError("Internal Server Error", 500);
    }
}

async function edit(data: any) {
    const { examId, name } = data.body;
    const date = data.date;
    const userId = data.userId;
    if (!examId || !name || !date) throw new AppError("No data provided!", 400);

    const query = `UPDATE exams SET name = $1, date = $2 WHERE subject = $3 AND owner = $4`;
    try {
        const result = await pool.query(query, [name, date, examId, userId]);
        if (result.rowCount == 0 || result.rowCount == null) throw new AppError("Could not edit exam!", 404);

        return result.rows[0];
    } catch (err) {
        logger.error(err);
        throw new AppError("Internal Server Error");
    }
}

async function get(data: any) {
    const userId = data.userId;

    const query = `SELECT name, subject, date FROM exams WHERE owner = $1`;
    try {
        const result = await pool.query(query, [userId]);
        if (result.rowCount == 0 || result.rowCount == null) throw new AppError("No subject found!", 404);

        return result.rows;
    } catch (err) {
        logger.error(err);
        throw new AppError("Internal Server Error");
    }
}

export = {
    create,
    remove,
    edit,
    get
}