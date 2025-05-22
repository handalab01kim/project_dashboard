import express from "express";
import controller from "./project-history.controller";
import { validate } from '../../middleware/validate';
import { idParamSchema, contentHistorySchema, projectNameParamSchema } from './project-history.schema';
const router = express.Router();

router.get("/:project", validate(projectNameParamSchema, "params"), controller.getProjectHistory);
router.post("/:project", validate(projectNameParamSchema, "params"), validate(contentHistorySchema), controller.createProjectHistory);
router.patch("/:id", validate(idParamSchema, "params"), validate(contentHistorySchema), controller.updateProjectHistory);
router.delete("/:id", validate(idParamSchema, "params"), controller.deleteProjectHistory);

export default router;