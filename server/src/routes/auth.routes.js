import { Router } from 'express';
import { User } from '../models/index.js';
import { encrypt, mask } from '../services/crypto.js';
import dotenv from "dotenv";
import { login } from '../controllers/auth.controller.js';

dotenv.config();

const r = Router();

r.post('/register', async (req, res) => {
    const { email, password, name, dob, mobile } = req.body;
    console.log(req.body)
    const user = await User.create({
        email,
        passwordHash: password,
        nameEnc: name ? encrypt(name) : null,
        dobEnc: dob ? encrypt(dob) : null,
        mobileEnc: mobile ? encrypt(mobile) : null
    });
    res.json({ user: user.toSafeJSON() });
});

r.post('/login', login)



export default r;
