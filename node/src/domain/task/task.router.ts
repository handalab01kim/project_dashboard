import express from "express";
import controller from "./task.controller";
import { validate } from '../../middleware/validate';
import {taskIdParamSchema,updateTaskSchema, createTaskSchema, } from "./task.schema";
const router = express.Router();

router.get("/task-list", controller.getAllTasks);
router.get("/:id", validate(taskIdParamSchema, "params"), controller.getTask);
router.post("/", validate(createTaskSchema), controller.createTask);
router.patch("/:id", validate(updateTaskSchema), controller.updateTask);
router.delete("/:id", validate(taskIdParamSchema, "params"), controller.deleteTask);

export default router;