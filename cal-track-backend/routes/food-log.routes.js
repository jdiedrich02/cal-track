import express from "express";
import { getTodayLog, createLogEntry, deleteLogEntry, getHistorySummary } from "../controllers/food-log.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/today", authenticate, getTodayLog);
router.get("/history", authenticate, getHistorySummary);
router.post("/create", authenticate, createLogEntry);
router.delete("/:id", authenticate, deleteLogEntry);

export default router;
