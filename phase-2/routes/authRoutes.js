const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

const issueToken = (res, user) => {
    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 1000,
    });
};

// Register
router.post("/register", async (req, res) => {
    const { email, password, username } = req.body;
    try {
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "Email already exists" });

        const newUser = new User({ email, password, username });
        await newUser.save();

        issueToken(res, newUser);
        res.status(201).json({ message: "Registered successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Local Login
router.post("/login", (req, res, next) => {
    passport.authenticate("local", { session: false }, (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ message: info.message });

        issueToken(res, user);
        res.json({ message: "Logged in successfully" });
    })(req, res, next);
});

// Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login", session: false }),
    (req, res) => {
        issueToken(res, req.user);
        res.redirect("/profile");
    }
);

// Logout
router.get("/logout", (req, res) => {
    res.clearCookie("token");
    req.logout(() => {
        res.json({ message: "Logged out" });
    });
});

module.exports = router;
