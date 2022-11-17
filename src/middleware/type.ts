import { Request } from "express"

export interface RoleRequest extends Request {
  userData?: any
  headers: any
} ;

