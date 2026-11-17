import { Router } from "express";
import { validate } from "../middleware/validate.middleware";
import {UserLoginSchema, UserRegisterSchema} from "../schemas/user.schem";
import UserService from "../services/user.service";
import { AppError } from "../util/app.error";
import { resConstructor } from "../util/res.constructor";

const router = Router();

router.post(
    "/register",
    validate(UserRegisterSchema),
    async (req, res, next) => {
        if (!req.body) {
            throw new AppError("No body provided!", 400);
        }

        try {
            await UserService.register(req.body);

            return res.status(201).json(
                resConstructor(
                    req,
                    false,
                    true,
                    "Created new user",
                    201
                ),
            );
        } catch (error: unknown) {
            return next(error);
        }
    },
);

router.post("/login", validate(UserLoginSchema), async (req, res) => {
    const result = await UserService.login(req.body);

    return res.status(201).json(resConstructor(
        req,
        false,
        true,
        "Logged in successfully",
        201,
        {
            data: result
        }
    ));
})

router.get("/verify", async (req, res) => {
    const verificationToken = req.query.token;
    if (!verificationToken) {
        throw new AppError("No verification token provided!", 400);
    }

    // @ts-ignore
    await UserService.verifyMail(verificationToken);

    return res.status(201).json(resConstructor(
        req,
        false,
        true,
        "Verified your email address!",
        201
    ))
})

export default router;