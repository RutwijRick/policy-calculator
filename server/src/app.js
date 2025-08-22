import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from './routes/user.routes.js';
import policyRoutes from './routes/policy.routes.js';

import calcRoutes from './routes/calc.routes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.json({ message: "Benefit Calculator API is running 🚀" });
});
app.use("/api/auth/", authRoutes);
app.use("/api/user/", userRoutes);
app.use("/api/policy/", policyRoutes);

// testing 
app.use('/api', calcRoutes);
// app.use("/api/benefits/", benefitsRoutes);

export default app;
