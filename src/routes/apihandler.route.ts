import Router from "express";
import v1Handler from "./v1handler.route";

Router().use("/v1", v1Handler);

export default Router;