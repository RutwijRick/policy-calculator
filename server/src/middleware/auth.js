import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();

export const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) return res.sendStatus(401);

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            console.log(err)
            if (err) return res.sendStatus(403);
            req.user = decoded;
            next();
        });
    } catch {
        console.log(err);
    }
};