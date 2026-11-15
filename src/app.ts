import express, {Request, response} from "express";
import cors from 'cors';
import helmet from 'helmet';
import APIHandler from "./routes/apihandler.route";
import apiLog from "./middleware/log";
import {errorHandler} from "./middleware/error";

const app = express();

app.use(cors());
app.use(express.json());
app.use(apiLog);
app.use(express.urlencoded({ extended: true }));
app.use(helmet())

app.use("/api", APIHandler);

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