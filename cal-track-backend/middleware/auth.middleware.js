import jwt from "jsonwebtoken";

/**
 * Authentication middleware, used to check if the user is properly authenticated in the application
 */
export function authenticate(req, res, next) {
    const token = req.cookies.auth;
    if (!token) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload;
        next();
    } catch(error) {
        console.error(error);
        return res.status(401).json({ message: 'Token expired or invalid' });
    }
}