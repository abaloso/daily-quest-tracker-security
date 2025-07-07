const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeRoles } = require("../middleware/auth");

// Protected: /profile
router.get("/profile", authenticateToken, (req, res) => {
    res.json({ message: `Welcome, ${req.user.role}! This is your profile.` });
});

// Protected: /admin (Admin only)
router.get("/admin", authenticateToken, authorizeRoles("Admin"), (req, res) => {
    res.json({ message: "Welcome to the admin panel." });
});

// Protected: /dashboard (all roles, but role-aware content)
router.get("/dashboard", authenticateToken, (req, res) => {
    const dashboardData = {
        User: "Here’s your quest progress and XP.",
        Admin: "Here’s your admin dashboard + system stats."
    };
    res.json({ role: req.user.role, message: dashboardData[req.user.role] });
});

module.exports = router;
