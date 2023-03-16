
import { Response, NextFunction } from 'express';
import { ApiError } from '@point-hub/express-error-handler';
import { db } from "../database/database.js";
import { verify } from "../utils/hash.js";
import RequestWithUser from '../interfaces/RequestWithUser';
import { QueryInterface } from '../database/connection.js';
import { UserRepository } from '../modules/auth/repositories/user.repository.js';

async function password(req: RequestWithUser, res: Response, next: NextFunction) {
  try {
    const query: QueryInterface = {
      fields: "",
      filter: { username: req?.user?.username },
      page: 1,
      pageSize: 1,
      sort: {},
    };

    const userRepository = new UserRepository(db);
    const result = (await userRepository.readMany(query)) as any;

    let isVerified = false;
    if (result.pagination.totalDocument === 1) {
      isVerified = await verify(result.data[0].password, req.body.password);
    }

    if (!isVerified) {
      throw new ApiError(401, { message: "You must be confirm your password" });
    }
 
    next();
  } catch (error) {
    next(error);
  }
}

export default password