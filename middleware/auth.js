function isAuthenticated(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  res.status(401).json({ error: "Please log in to access this resource" });
}

module.exports = { isAuthenticated };
