import express from "express";
import { getUserById } from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/me", authMiddleware, getUserById);

export default router;
