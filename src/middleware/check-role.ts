import { Request, NextFunction, Response } from 'express';
const jwt = require('jsonwebtoken');

interface RoleRequest extends Request {
  userData?: any
} 
module.exports = (req : RoleRequest, res: Response , next: NextFunction) => {
  if (!req.headers.authorization){
    return res.status(401).json({
      message: 'Need authorization in '+ process.env.BASE_URL + req.baseUrl  ,
      currentRoles: null, 
      uri: process.env.BASE_URL + req.baseUrl 
    });
  }
  
  try {
    const decoded = jwt.verify(req.headers.authorization?.split(' ')[1], process.env.JWT_SECRET)
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
