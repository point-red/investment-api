import RequestWithUser  from '@src/interfaces/RequestWithUser.js';
import { BankInterface } from './../entities/bank.entity';
import { NextFunction, Response } from "express";
import { db } from "@src/database/database.js";
import { BankRepository } from '../repositories/bank.repository.js';
import { ApiError } from '@point-hub/express-error-handler';
import { RequestDeleteApproveBankService } from '../services/request-delete-approve.service.js';

export const requestDeleteApprove = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const session = db.startSession();

    db.startTransaction();

    const bankRepository = new BankRepository(db);
    const result = (await bankRepository.read(req.params.id)) as unknown as BankInterface;
    
    if(result.requestApprovalDeleteStatus !== "pending") throw new ApiError(404)

    if(req.user?._id?.toString() !== result.requestApprovalDeleteTo_id?.toString()) throw new ApiError(403);

    const requestDeleteApproveBankService = new RequestDeleteApproveBankService(db);
    await requestDeleteApproveBankService.handle(req.params.id, session);

    await db.commitTransaction();

    res.status(204).json();
  } catch (error) {
    await db.abortTransaction();
    next(error);
  } finally {
    await db.endSession();
  }
};
