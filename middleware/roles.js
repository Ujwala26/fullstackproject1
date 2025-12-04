const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

// Tenant isolation middleware
const tenantMiddleware = (Model) => {
  return (req, res, next) => {
    req.query.tenantId = req.user.tenantId;
    next();
  };
};

module.exports = { roleMiddleware, tenantMiddleware };
