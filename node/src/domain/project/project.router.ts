import express from "express";
import controller from "./project.controller";
import { validate } from '../../middleware/validate';
import { projectSchema } from './project.schema';
const router = express.Router();

router.get("/project-list", controller.getProjects);
router.get("/:id", validate(projectSchema, "query"), controller.getProject);
router.post("/", validate(projectSchema, "query"), controller.createProject);
router.patch("/:id", validate(projectSchema, "query"), controller.updateProject);
router.delete("/:id", validate(projectSchema, "query"), controller.deleteProject);

export default router;