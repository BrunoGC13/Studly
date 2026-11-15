import Router from 'express';
import {validateRegistration} from "../middleware/user.middleware";
import {UserRegisterSchema} from "../schemas/user.schem";
import register from '../services/user.service';

Router().post("/register", validateRegistration(UserRegisterSchema), async (req, res, next) => {
    try {
        const userData = req.body;
        if (!userData) return next(new Error())

        const result = await register(userData);
    } catch (error) {
        next(error);
    }
});