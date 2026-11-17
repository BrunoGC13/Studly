import { Router } from "express";
import { validate } from "../middleware/validate.middleware";
import { AppError } from "../util/app.error";
import { resConstructor } from "../util/res.constructor";
import {authenticateToken} from "../middleware/auth.middleware";
import HomeworkService from '../services/homework.service';
import {HomeworkCreationSchema, HomeworkDeletionSchema, HomeworkEditSchema} from "../schemas/homework.schem";
import {DateFromStringDate} from "../schemas/date.schem";
import {date} from "../middleware/date.middleware";

const router = Router();

router.post("/create", authenticateToken, validate(DateFromStringDate), validate(HomeworkCreationSchema), async (req, res) => {
    if (!req.body) throw new AppError("No body provided!", 400);
    const data = date(req.body.date, req);

    const result = await HomeworkService.create(data);
    return res.status(201).json(resConstructor(
        req,
        false,
        true,
        "Successfully added homework!",
        201,
        {
            data: result
        }
    ));
});

router.delete("/remove", authenticateToken, validate(HomeworkDeletionSchema), async (req, res) => {
    if (!req.body) throw new AppError("No body provided!", 400);

    const result = await HomeworkService.remove(req);
    return res.status(201).json(resConstructor(
        req,
        false,
        true,
        "Successfully deleted homework!",
        201,
        {
            data: result
        }
    ));
});

router.put("/edit", authenticateToken, validate(DateFromStringDate), validate(HomeworkEditSchema), async (req, res) => {
    if (!req.body) throw new AppError("No body provided!", 400);
    const data = date(req.body.date, req);

    const result = await HomeworkService.edit(data);
    return res.status(201).json(resConstructor(
        req,
        false,
        true,
        "Successfully edited homework!",
        201,
        {
            data: result
        }
    ));
});

export default router;