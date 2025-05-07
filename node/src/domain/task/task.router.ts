import express from "express";
import controller from "./task.controller";
const router = express.Router();

router.get("/task-list", controller.getTasks);

export default router;