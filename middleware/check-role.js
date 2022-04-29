const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const decoded = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET)
    req.userData = decoded;
    console.log("userData " + JSON.stringify(req.userData));
    if (!decoded.userStatus || decoded.userStatus != 'ADMIN') {
      console.log("ADMIN ")
      return res.status(401).json({
        message: 'Roles Admin only ',
        currentRoles: decoded.userStatus
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'auth failed',
      error: error
    });
  }
}
