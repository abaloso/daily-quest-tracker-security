const jwt = require("jsonwebtoken");

// Verify JWT and attach user to request
const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid token" });
    }
};

// Check if user has one of the required roles
const authorizeRoles = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Forbidden – insufficient rights" });
    }
    next();
};

module.exports = {
    authenticateToken,
    authorizeRoles,
};