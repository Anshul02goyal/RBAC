const authorize = (allowedRoles) => {
  return (req, res, next) => {
    try {
      // Check if the user's role is included in the allowed roles
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied: You do not have permission to access this resource' });
      }
      next(); // Allow access if the user has a valid role
    } catch (error) {
      // Handle errors if something goes wrong with the authorization process
      res.status(500).json({
        message: 'Authorization error: Failed to check user role',
        error: error.message || 'An unexpected error occurred during authorization'
      });
    }
  };
};

module.exports = authorize;
