import express, {Request, response} from "express";
import cors from 'cors';
import helmet from 'helmet';
import APIHandler from "./routes/apihandler.route";
import apiLog from "./middleware/log";
import {errorHandler} from "./middleware/error";
import path from 'path';

const app = express();

app.use(cors());
app.use(express.json());
app.use(apiLog);
app.use(express.urlencoded({ extended: true }));
app.use(helmet({
    contentSecurityPolicy: false,
}));

const publicDirectory = path.join(__dirname, "public");

app.use(express.static(publicDirectory));

app.use("/api", APIHandler);

app.get("/", (req, res, next) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

// Add a not-found handler before the general error handler.
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: true,
        msg: "Route not found",
        code: 404,
        call: {
            method: req.method,
            endpoint: req.originalUrl,
        },
        time: new Date().toISOString(),
    });
});

app.use(errorHandler);

export default app;