import express from "express";
import { getAllMacros, getMacroById, createMacro, updateMacro, deleteMacro } from "../controllers/macros.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// GET Requests
router.get("/all", authenticate, getAllMacros);
router.get("/:id", authenticate, getMacroById);

// POST Requests
router.post("/create", authenticate, createMacro);

// PUT Requests
router.put("/:id", authenticate, updateMacro);

// DELETE Requests
router.delete("/delete/:id", authenticate, deleteMacro);

export default router;