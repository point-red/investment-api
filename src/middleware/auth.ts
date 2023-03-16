import { RoleInterface } from './../modules/roles/entities/role.entity.js';
import { ReadRoleService } from './../modules/roles/services/read.service.js';
import { ReadUserService } from './../modules/users/services/read.service.js';
import { secretKey } from "@src/config/auth.js";
import { Response, NextFunction } from 'express';
import { ApiError } from '@point-hub/express-error-handler';
import { db } from "@src/database/database.js";
import RequestWithUser from '@src/interfaces/RequestWithUser';
import { verifyToken } from "@src/utils/jwt.js";
 
async function auth(req: RequestWithUser, res: Response, next: NextFunction) {
  try {
    const authorizationHeader = req.headers.authorization ?? "";

    if (authorizationHeader === "") {
      throw new ApiError(401);
    }

    const authorization: any = verifyToken(authorizationHeader.split(" ")[1], secretKey);

    const readUserService = new ReadUserService(db);

    const user = await readUserService.handle(authorization.sub, {
      restrictedFields: ["password"],
    });

    if(!user) {
      throw new ApiError(401);
    }

    const readRoleService = new ReadRoleService(db);
    const role = (await readRoleService.handle(user.role_id)) as RoleInterface;
    
    if(role) {
      user.permissions = role.permissions
    }
     
    req.user = user;
 
    next();
  } catch (error) {
    next(error);
  }
}

export default auth