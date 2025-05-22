import express from "express";
import controller from "./project.controller";
import { validate } from '../../middleware/validate';
import { projectIdParamSchema, updateProjectSchema, createProjectSchema } from './project.schema';
const router = express.Router();

router.get("/project-list", controller.getProjects);
router.get("/:id", validate(projectIdParamSchema, "params"), controller.getProject);
router.post("/", validate(createProjectSchema), controller.createProject);
router.patch("/:id", validate(projectIdParamSchema, "params"), validate(updateProjectSchema), controller.updateProject);
router.delete("/:id", validate(projectIdParamSchema, "params"), controller.deleteProject);

export default router;