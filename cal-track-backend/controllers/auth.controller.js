import { User } from "../models/user.model.js";
import { hashPassword, verifyPassword, createToken } from "../utils/hash.js";

/**
 * Handles signup logic
 * API: /api/auth/register
 */
export async function signup(req, res) {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findByUsername(username);

        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        // New User
        const hashPwd = await hashPassword(password);
        await User.create(username, email, hashPwd);
        res.status(201).json({ message: "User created" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to signup' });
    }
}

/**
 * Handles login logic
 * API: /api/auth/login
 */
export async function login(req, res) {
    try {
        const { username, password } = req.body;
        const user = await User.findByUsernameWithPasswordHash(username);

        if (!user) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const valid = await verifyPassword(password, user.password_hash);
        if (!valid) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const token = createToken(user);

        // Send Token back as JWT
        res.cookie("auth", token, {
            httpOnly: true,
            secure: false,
            maxAge: 30 * 60 * 1000
        });

        res.json({ message: 'Logged In Successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to login' });
    }
}

/**
 * Handles logout logic
 * API: /api/auth/logout
 */
export async function logout(req, res) {
    // Clear the cookie by name
    res.clearCookie("auth", {
        httpOnly: true,
        secure: false
    });

    res.json({ message: "Logged out successfully" });
}

/**
 * Used to check if the user is logged in and returns safe data about the user
 * API: /api/auth/me
 */
export async function me(req, res) {
    res.json({ id: req.user.id, username: req.user.username });
}