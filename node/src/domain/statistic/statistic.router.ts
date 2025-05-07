import express from "express";
import controller from "./statistic.controller";
const router = express.Router();

router.get("/statistic", controller.getStatistic);

export default router;