import Router from "express";

import userController from "../controllers/user.controller";
import subjectsController from "../controllers/subject.controller";

const router = Router();

router.use("/user", userController);
// router.use("/homework", homeworkController);
// router.use("/exams", examsController);
router.use("/subjects", subjectsController);

export default router;

