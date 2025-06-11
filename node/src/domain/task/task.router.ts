import express from "express";
import controller from "./task.controller";
import { validate } from '../../middleware/validate';
import {taskIdParamSchema, updateTaskSchema, createTaskSchema, weekSchema,} from "./task.schema";
const router = express.Router();

router.get("/task-list", validate(weekSchema, "query"), controller.getTasksByWeek);
router.get("/monthly/:year/:month", controller.getTasksByMothAndWeek);
router.get("/assignees", controller.getAssignees);
router.get("/:id", validate(taskIdParamSchema, "params"), controller.getTask);
router.post("/", validate(createTaskSchema), controller.createTask);
router.patch("/:id", validate(taskIdParamSchema, "params"), validate(updateTaskSchema), controller.updateTask);
router.delete("/:id", validate(taskIdParamSchema, "params"), controller.deleteTask);

export default router;