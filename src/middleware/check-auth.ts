import { RoleRequest } from "./type";
import { Response, NextFunction } from "express";

const jwt = require('jsonwebtoken');


module.exports = (req: RoleRequest, res: Response, next: NextFunction) => {
  try {
    const decoded = jwt.verify(req.headers?.authorization.split(' ')[1],
      process.env.JWT_SECRET)
    req.userData = decoded;
    console.log("userData " + JSON.stringify(req.userData));
    next();
  } catch (error) {
    console.log("error: " + JSON.stringify(error));
    return res.status(401).json({
      message: 'auth failed',
      error: error
    });
  }

}