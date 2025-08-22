import express from 'express';
import { calculateIllustration, generateIllustration } from '../controllers/calc.controller.js';
import {authMiddleware} from '../middleware/auth.js';
import { calculateBenefit } from '../controllers/calc.controller.js';

const router = express.Router();

router.post('/calculate', authMiddleware, calculateBenefit);
router.get("/calculate/:policyId", authMiddleware, generateIllustration);

export default router;
