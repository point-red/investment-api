import { UserInterface } from '@src/modules/users/entities/user.entity';
import { UserRepository } from '@src/modules/users/repositories/user.repository.js';
import { NextFunction, Request, Response } from "express";
import { validate } from "../request/request-delete.request.js";
import { RequestDeleteOwnerService } from "../services/request-delete.service.js";
import { db } from "@src/database/database.js";
import { ReadOwnerService } from "../services/read.service.js";
import { OwnerInterface } from "../entities/owner.entity.js";

export const requestDelete = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = db.startSession();

    db.startTransaction();

    validate(req.body);

    const readOwnerService = new ReadOwnerService(db);
    (await readOwnerService.handle(req.params.id)) as OwnerInterface;

    const userRepository = new UserRepository(db);
    (await userRepository.read(req.body.approvalTo)) as UserInterface;

    const requestDeleteOwnerService = new RequestDeleteOwnerService(db);
    await requestDeleteOwnerService.handle(req.params.id, req.body, session);

    await db.commitTransaction();

    res.status(204).json();
  } catch (error) {
    await db.abortTransaction();
    next(error);
  } finally {
    await db.endSession();
  }
};
