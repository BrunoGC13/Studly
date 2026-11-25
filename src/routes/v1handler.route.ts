import Router from "express";

import userController from "../controllers/user.controller";
import subjectsController from "../controllers/subject.controller";
import homeworkController from "../controllers/homework.controller";
import examsController from "../controllers/exam.controller";
import pdfController from "../controllers/pdf.controller";

const router = Router();

router.use("/user", userController);
router.use("/homework", homeworkController);
router.use("/exams", examsController);
router.use("/subjects", subjectsController);
router.use("/worksheets", pdfController);

export default router;

