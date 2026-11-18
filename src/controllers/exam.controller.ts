import { Router } from "express";
import { validate } from "../middleware/validate.middleware";
import { AppError } from "../util/app.error";
import { resConstructor } from "../util/res.constructor";
import {authenticateToken} from "../middleware/auth.middleware";
import {DateFromStringDate} from "../schemas/date.schem";
import {date} from "../middleware/date.middleware";
import {ExamCreationSchem, ExamEditSchema, ExamRemovalScheme} from "../schemas/exam.schem";
import ExamService from '../services/exam.service';

const router = Router();

router.post("/create", authenticateToken, validate(DateFromStringDate), validate(ExamCreationSchem), async (req, res) => {
    if (!req.body) throw new AppError("No body provided!", 400);
    const data = date(req.body.date, req);

    const result = await ExamService.create(data);
    return res.status(201).json(resConstructor(
        req,
        false,
        true,
        "Successfully added exam!",
        201,
        {
            data: result
        }
    ))
})

router.delete("/delete", authenticateToken, validate(ExamRemovalScheme), async (req, res) => {
    if (!req.body) throw new AppError("No body provided!", 400);

    const result = await ExamService.remove(req);
    return res.status(201).json(resConstructor(
        req,
        false,
        true,
        "Successfully removed exam!",
        201,
        {
            data: result
        }
    ))
})

router.put("/edit", authenticateToken, validate(ExamEditSchema), async (req, res) => {
    if (!req.body) throw new AppError("No body provided!", 400);
    const data = date(req.body.date, req);

    const result = await ExamService.edit(data);
    return res.status(201).json(resConstructor(
        req,
        false,
        true,
        "Successfully edited exam!",
        201,
        {
            data: result
        }
    ))
})

router.post("/get", authenticateToken, async (req, res) => {
    if (!req.body) throw new AppError("No body provided!", 400);

    const result = await ExamService.get(req);
    return res.status(201).json(resConstructor(
        req,
        false,
        true,
        "Successfully got exams!",
        201,
        {
            data: result
        }
    ))
})

export default router;