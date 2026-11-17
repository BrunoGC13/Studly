import { Router } from "express";
import { validate } from "../middleware/validate.middleware";
import { AppError } from "../util/app.error";
import { resConstructor } from "../util/res.constructor";
import {SubjectCreationSchema, SubjectEditSchema, SubjectRemoveSchema} from "../schemas/subject.schem";
import SubjectService from '../services/subject.service';
import {authenticateToken} from "../middleware/auth.middleware";

const router = Router();

router.post("/create", authenticateToken, validate(SubjectCreationSchema), async (req, res) => {
    if (!req.body) {
        throw new AppError("No body provided!", 400);
    }

    const result = await SubjectService.create(req);
    return res.status(201).json(resConstructor(req, false, true, "Successfully created new subject!", 201, {
        data: result
    }));
})

router.delete("/remove", authenticateToken, validate(SubjectRemoveSchema), async (req, res) => {
    if (!req.body) {
        throw new AppError("No body provided!", 400);
    }

    const result = await SubjectService.remove(req);
    return res.status(201).json(resConstructor(req, false, true, "Successfully removed subject!", 201, {
        data: result
    }));
})

router.put("/edit", authenticateToken, validate(SubjectEditSchema), async (req, res) => {
    if (!req.body) {
        throw new AppError("No body provided!", 400);
    }

    const result = await SubjectService.edit(req);
    return res.status(201).json(resConstructor(req, false, true, "Successfully edited subject!", 201, {
        data: result
    }));
})

router.post("/get", authenticateToken, async (req, res) => {
    if (!req.body) throw new AppError("No body provided!", 400);

    const result = await SubjectService.get(req);
    return res.status(201).json(resConstructor(
        req,
        false,
        true,
        "Got subjects",
        201,
        {
            data: result
        }
    ))
});

export default router;