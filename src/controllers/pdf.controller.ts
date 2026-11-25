import { Router } from "express";
import { validate } from "../middleware/validate.middleware";
import { AppError } from "../util/app.error";
import { resConstructor } from "../util/res.constructor";
import {authenticateToken} from "../middleware/auth.middleware";
import PDFService from '../services/pdf.service';
import {RetrieveWorksheetSchema, WorksheetUploadSchema} from "../schemas/pdf.schem";

const router = Router();

router.post("/upload", authenticateToken, validate(WorksheetUploadSchema), async (req, res) => {
    if (!req.body) throw new AppError("No body provided!", 500);

    const result = await PDFService.upload(req);
    return res.status(201).json(resConstructor(
        req,
        false,
        true,
        "Succesfully uploaded worksheet!",
        201,
        {
            data: result
        }
    ))
})

router.post("/retrieve", authenticateToken, validate(RetrieveWorksheetSchema), async (req, res) => {
    if (!req.body) throw new AppError("No body provided!", 500);

    const result = await PDFService.retrieve(req);
    return res.status(201).json(resConstructor(
        req,
        false,
        true,
        "Retrieved file",
        201,
        {
            data: result
        }
    ))
})

export default router;