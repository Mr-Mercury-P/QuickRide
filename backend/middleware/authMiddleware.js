const { validateToken } = require("../config/jwt");
const User = require("../models/User");

const authMiddleware = (req, res, next) => {
    // Get token from the 'Authorization' header (case insensitive)
    const token = req.headers.authorization;
    console.log("token from authMiddleware", token);

    // Check if the token exists and is in the correct format (starts with 'Bearer ')
    if (!token || !token.startsWith("Bearer ")) {
        return res.status(401).json({ "message": "Unauthorized user, token missing or invalid" });
    }

    try {
        // Remove 'Bearer ' prefix from the token and validate it
        const verify = validateToken(token.replace("Bearer ", ""));
        console.log("verify from authMiddleware", verify);
        console.log("verify id", verify.id);

        // Store only the user ID in the request object (instead of the whole token object)
        req.user = verify.id;
        req.user = verify;
        
        next();
    } catch (err) {
        console.log("error from authMiddleware", err);
        res.status(400).json({ "message": "Invalid token or expired" });
    }
};

const verifyAdmin = async (req, res, next) => {
    try {
        // Find the user by ID stored in the request object
        const user = await User.findById(req.user);
        if (!user || user.role !== "admin") {
            return res.status(401).json({ "message": "Access denied" });
        }
        next();
    } catch (err) {
        console.log(err);
        res.status(500).json({ "message": "Internal server error from verifyAdmin" });
    }
};

module.exports = { authMiddleware, verifyAdmin };
