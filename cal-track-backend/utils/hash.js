import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * Hashes the user password passed in
 */
export async function hashPassword(password) {
    return await bcrypt.hash(password, 12);
}

/**
 * Verifys that the password string and the password hash match
 */
export async function verifyPassword(password, hash) {
    return await bcrypt.compare(password, hash);
}

/**
 * Creates JWT token for the given user
 */
export function createToken(user) {
    return jwt.sign(
        {
            id: user.id,
            username: user.username
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES
        }
    );
}