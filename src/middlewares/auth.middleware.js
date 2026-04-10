const jwt = require('jsonwebtoken');
const blacklistTokenModel = require('../models/blacklist.model');

/**
 * @name authMiddleware
 * @desc Middleware to protect routes by verifying JWT tokens. It checks if the token is present in the request header, verifies it, checks if it's blacklisted, and attaches the user information to the request object for further use in the route handlers.
 * @access Private
 */
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const blacklistedToken = await blacklistTokenModel.findOne({ token });
        if (blacklistedToken) {
            return res.status(401).json({ message: "Token is blacklisted" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Error in auth middleware:", error);
        res.status(401).json({ message: "Invalid token" });
    }
}

module.exports = { authUser: authMiddleware };