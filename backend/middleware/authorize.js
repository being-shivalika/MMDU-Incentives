const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // Ensure protect middleware ran first
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, user missing",
      });
    }

    // Check role permission
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: role '${req.user.role}' cannot access this resource`,
      });
    }

    next();
  };
};

export default authorize;
