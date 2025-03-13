const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { generateToken } = require("../config/jwt");
const User = require("../models/User");

// Signup Route
router.post("/signup", async (req, res) => {
    try {
        const { username, email, password, mobile } = req.body;
        console.log(username, email, password, mobile);

        let existingUser = await User.findOne({ email });
        console.log(existingUser)
        if (existingUser) {
            return res.status(400).json({ "message": "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            username, email, password: hashedPassword, mobile
        });
        console.log("Signup successful", newUser);
        const token = generateToken(newUser._id);
        res.status(201).json({ "message": "User created", token, role: newUser.role });
    } catch (err) {
        console.log(err);
        res.status(500).json({ "message": "Internal server error" });
    }
});

// Login Route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Login attempt", req.body);

        const user = await User.findOne({ email });
                console.log("Login attempt", req.body);

        if (!user) {
            return res.status(400).json({ "message": "User not found" });
        }
        console.log(user);
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ "message": "Password incorrect" });
        }

        const token = generateToken(user._id); // Pass user._id
        console.log("Login successful: token", token);
        
        res.status(200).json({
            "message": "Login successful",
            "token": token,
            "userId": user._id, // Send user ID
            "role": user.role
        });
    } catch (err) {
        console.log("Error from login", err);
        res.status(500).json({ "message": "Internal server error from login route" });
    }
});

// Remove these if they're not needed
// router.get('/signup', (req, res) => { res.send('Hello from signup route') });
// router.get('/login', (req, res) => { res.send('Hello from login route') });

module.exports = router;
