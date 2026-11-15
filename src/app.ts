import express, {Request, response} from "express";
import https from 'https';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

import APIHandler from "./routes/apihandler.route";
import logger from './util/logger';
import apiLog from "./middleware/log";
import {errorHandler} from "./middleware/error";

dotenv.config({
    path: path.resolve(__dirname, './config/.env')
});

const port: string | number = process.env.PORT || 3000;

const keyPath: string = process.env.PRIVATE_KEY || './privatekey.pem';
const certPath: string = process.env.PRIVATE_CERT || './cert.pem';

const httpsConfig = {
    key: fs.readFileSync(path.resolve(__dirname, keyPath)),
    cert: fs.readFileSync(path.resolve(__dirname, certPath)),
}

const app = express();

app.use(express.json());
app.use(cors());
app.use(apiLog);
app.use(errorHandler);

app.use("/api", APIHandler)

// Start
if (process.env.NODE_ENV === "production") {
    https.createServer(httpsConfig, app).listen(port, () => logger.info(`Listening on https://localhost:${port}`));
} else {
    app.listen(port, () => {
        logger.info(`Listening on http://localhost:${port}`);
    })
}