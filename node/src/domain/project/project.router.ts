import express from "express";
import controller from "./project.controller";
const router = express.Router();

router.get("/project-list", controller.getProjects);

export default router;