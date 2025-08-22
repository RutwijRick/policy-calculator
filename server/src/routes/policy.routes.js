import { Router } from 'express';
import { calculatePolicy, savePolicy, getPoliciesByUser, getPolicyById, deletePolicyById } from "../controllers/policy.controller.js";
import { authMiddleware } from "../middleware/auth.js";


const router = Router();

router.get("/:id", authMiddleware, getPolicyById);

router.delete("/:id", authMiddleware, deletePolicyById);

router.post("/calculate", authMiddleware, calculatePolicy);

router.post("/save", authMiddleware, savePolicy);

router.get("/user/:userId", authMiddleware, getPoliciesByUser);


export default router;
