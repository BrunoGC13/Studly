import Router from "express";
import v1Handler from "./v1handler.route";

const router = Router();

router.use("/v1", v1Handler);

export default router;