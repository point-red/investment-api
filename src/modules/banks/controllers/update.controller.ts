import { NextFunction, Response } from "express";
import { validate } from "../request/update.request.js";
import { UpdateBankService } from "../services/update.service.js";
import { db } from "@src/database/database.js";
import RequestWithUser from "@src/interfaces/RequestWithUser.js";
import { ReadBankService } from "../services/read.service.js";
import { BankInterface } from "../entities/bank.entity.js";

export const update = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const session = db.startSession();

    db.startTransaction();

    validate(req.body);

    const readBankService = new ReadBankService(db);
    (await readBankService.handle(req.params.id)) as BankInterface;

    const updateBankService = new UpdateBankService(db);
    await updateBankService.handle(req.params.id, { ...req.body, updatedBy_id: req.user?._id }, session);

    await db.commitTransaction();

    res.status(204).json();
  } catch (error) {
    await db.abortTransaction();
    next(error);
  } finally {
    await db.endSession();
  }
};
