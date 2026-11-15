import { Pool } from "pg";
import cron from 'node-cron';
import logger from "../util/logger";

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
});

async function verifyConnection(): Promise<void> {
    try {
        const client = await pool.connect();
        logger.info(`Successfully connected to database.`);
        client.release();
    } catch (err) {
        logger.error(err);
    }
}

verifyConnection();

cron.schedule('* 5 * * *', () => {
    logger.info(`Schedules database health check running...`);
    verifyConnection();
});

export default pool;