import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import Benefit from "../models/Benefit.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
    try {
        const benefits = await Benefit.findAll({ where: { userId: req.user.id } });
        res.json(benefits);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
