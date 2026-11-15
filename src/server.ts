import dotenv from 'dotenv';
import path from 'path';
dotenv.config({
    path: path.resolve(__dirname, './config/.env')
});

import app from "./app";
import https from 'https';
import logger from './util/logger';
import cron from "node-cron";
import {EmailService} from "./services/email.service";
import fs from 'fs';

const port: string | number = process.env.PORT || 3000;

let keyPath: string;
let certPath: string;
let httpsConfig;

if (process.env.NODE_ENV === "production") {
    keyPath = process.env.PRIVATE_KEY || './privatekey.pem';
    certPath = process.env.PRIVATE_CERT || './cert.pem';

    httpsConfig = {
        key: fs.readFileSync(path.resolve(__dirname, keyPath)),
        cert: fs.readFileSync(path.resolve(__dirname, certPath)),
    }
}

EmailService.verifyConnection().then();
cron.schedule('* 5 * * *', async () => {
    logger.info(`Scheduled database health check running...`);
    await EmailService.verifyConnection();
})

// Start
if (process.env.NODE_ENV === "production") {
    // @ts-ignore
    https.createServer(httpsConfig, app).listen(port, () => logger.info(`Listening on https://localhost:${port}`));
} else {
    app.listen(port, () => {
        logger.info(`Listening on http://localhost:${port}`);
    })
}