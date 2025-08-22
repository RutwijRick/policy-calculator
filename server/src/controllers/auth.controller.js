import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import dotenv from "dotenv";
import { decrypt } from "../services/crypto.js";

dotenv.config();

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user || !(await user.checkPassword(password))) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // decrypt the encrypted name before sending
        const decryptedName = decrypt(user.nameEnc);
        res.json({
            token,
            user: { id: user.id, name: decryptedName, email: user.email },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};