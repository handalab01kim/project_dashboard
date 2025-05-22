import express from "express";
import projectRouter from "./domain/project/project.router";
import projectHistoryRouter from "./domain/project-history/project-history.router";
import taskRouter from "./domain/task/task.router";
// import statisticRouter from "./domain/statistic/statistic.router";
const router = express.Router();

router.use("/project", projectRouter);
router.use("/project-history", projectHistoryRouter);
router.use("/task", taskRouter);
// router.use("/team", statisticRouter);

export default router;  