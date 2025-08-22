import { decrypt } from "../services/crypto.js";
import { User } from "../models/index.js";

export const getUserById = async (req, res) => {
    try {
        // assume middleware `authMiddleware` sets req.user.id
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        // decrypt sensitive fields
        const name = user.nameEnc ? decrypt(user.nameEnc) : null;
        const dobStr = user.dobEnc ? decrypt(user.dobEnc) : null;

        // calculate age
        let age = null;
        if (dobStr) {
            const dob = new Date(dobStr);
            const today = new Date();
            age = today.getFullYear() - dob.getFullYear();
            const m = today.getMonth() - dob.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
                age--; // adjust if birthday not yet reached
            }
        }

        return res.json({
            id: user.id,
            name,
            dob: dobStr,
            age
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}