import { UserInterface } from '@src/modules/users/entities/user.entity';
import { UserRepository } from '@src/modules/auth/repositories/user.repository.js';
import { NextFunction, Request, Response } from "express";
import { validate } from "../request/request-delete.request.js";
import { RequestDeleteBankService } from "../services/request-delete.service.js";
import { db } from "@src/database/database.js";
import { ReadBankService } from "../services/read.service.js";
import { BankInterface } from "../entities/bank.entity.js";

export const requestDelete = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = db.startSession();

    db.startTransaction();

    validate(req.body);

    const readBankService = new ReadBankService(db);
    (await readBankService.handle(req.params.id)) as BankInterface;
 
    const userRepository = new UserRepository(db);
    (await userRepository.read(req.body.approvalTo)) as UserInterface;

    const requestDeleteBankService = new RequestDeleteBankService(db);
    await requestDeleteBankService.handle(req.params.id, req.body, session);

    await db.commitTransaction();

    res.status(204).json();
  } catch (error) {
    await db.abortTransaction();
    next(error);
  } finally {
    await db.endSession();
  }
};
