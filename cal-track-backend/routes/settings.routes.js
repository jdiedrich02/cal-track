import express from "express";
import { getSettingByUserId, updateSetting, createSetting } from "../controllers/settings.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/cal-settings", authenticate, getSettingByUserId);
router.post("/cal-settings", authenticate, createSetting);
router.put("/cal-settings", authenticate, updateSetting);

export default router;