// Backend/middleware/roleMiddleware.js
// Restricts routes to specific roles

// Usage: router.get("/admin", protect, requireRole("admin"), handler)
// Usage: router.get("/landlord", protect, requireRole("landlord", "admin"), handler)

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required role: ${roles.join(" or ")}`,
      });
    }

    next();
  };
};

module.exports = { requireRole };