import RequestWithUser from '@src/interfaces/RequestWithUser.js';
import { NextFunction, Response } from "express";
import { validate } from "../request/delete-reject.request.js";
import { RequestDeleteRejectBankService } from "../services/request-delete-reject.service.js";
import { db } from "@src/database/database.js";
import { BankInterface } from "../entities/bank.entity.js";
import { BankRepository } from "../repositories/bank.repository.js";
import { ApiError } from "@point-hub/express-error-handler";

export const requestDeleteReject = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const session = db.startSession();

    db.startTransaction();

    validate(req.body);

    const bankRepository = new BankRepository(db);
    const result = (await bankRepository.read(req.params.id)) as unknown as BankInterface;
    
    if(result.requestApprovalDeleteStatus !== "pending") throw new ApiError(404)

    if(req.user?._id?.toString() !== result.requestApprovalDeleteTo_id?.toString()) throw new ApiError(403);

    const requestDeleteRejectBankService = new RequestDeleteRejectBankService(db);
    await requestDeleteRejectBankService.handle(req.params.id, req.body, session);

    await db.commitTransaction();

    res.status(204).json();
  } catch (error) {
    await db.abortTransaction();
    next(error);
  } finally {
    await db.endSession();
  }
};
