import express from "express";
import controller from "./project.controller";
import { validate } from '../../middleware/validate';
import { projectSchema } from '../../schemas/project.schema';
const router = express.Router();

router.get("/project-list", validate(projectSchema, "query"), controller.getProjects);

export default router;