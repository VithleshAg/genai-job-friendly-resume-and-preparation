const userModel = require('../models/user.model');
const blacklistTokenModel = require('../models/blacklist.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * @name register
 * @desc Register a new user, expecting username, email and password in the request body. It checks if the user already exists, hashes the password, creates a new user, generates a JWT token and sends it back in the response.
 * @route POST /api/auth/register
 * @access Public
 */
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await userModel.findOne({
            $or: [{ username, email }]
        });

        if (existingUser) {
            return res.status(400).json({ message: "Account already exists with this email or username" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            username,
            email,
            password: hashedPassword
        });

        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,        // ← required for sameSite: none
            sameSite: 'none',    // ← required for cross-domain
            maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days (or whatever you have)
        })


        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Error in register:", error);
        res.status(500).json({ message: "Server error" });
    }
}

/**
 * @name login
 * @desc Login a user, expecting email and password in the request body. It checks if the user exists, compares the password, generates a JWT token and sends it back in the response.
 * @route POST /api/auth/login
 * @access Public
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,        // ← required for sameSite: none
            sameSite: 'none',    // ← required for cross-domain
            maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days (or whatever you have)
        })


        res.status(200).json({
            message: "User logged in successfully",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ message: "Server error" });
    }
}

/**
 * @name logout
 * @desc Logout a user by blacklisting the token and clearing the cookie.
 * @route POST /api/auth/logout
 * @access Public
 */
exports.logout = async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(400).json({ message: "No token provided" });
        }

        await blacklistTokenModel.create({ token });

        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        });

        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        console.error("Error in logout:", error);
        res.status(500).json({ message: "Server error" });
    }
}

/**
 * @name getMe
 * @desc Get current user details, expecting a valid JWT token in the request header. It verifies the token, retrieves the user details and sends them back in the response.
 * @route GET /api/auth/get-me
 * @access Private
 */
exports.getMe = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error("Error in getMe:", error);
        res.status(500).json({ message: "Server error" });
    }
}