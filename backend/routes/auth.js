import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

const generateToken = (userId, email) => {
    return jwt.sign(
        { userId, email },           
        process.env.JWT_SECRET,       
        { expiresIn: "7d" }           
    );
};

router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    try {

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered. Please sign in." });
        }

        const user = new User({ name, email, password });
        await user.save();

        const token = generateToken(user._id, user.email);

        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (err) {
        console.log("Signup error:", err);
        res.status(500).json({ error: "Failed to create account" });
    }
});

router.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });

        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid email or password" });

        }

        const token = generateToken(user._id, user.email);

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (err) {
        console.log("Signin error:", err);
        res.status(500).json({ error: "Failed to sign in" });
    }
});

export default router;
