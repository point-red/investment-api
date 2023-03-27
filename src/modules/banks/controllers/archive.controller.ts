import { NextFunction, Response } from "express";
import { ArchiveBankService } from "../services/archive.service.js";
import { db } from "@src/database/database.js";
import RequestWithUser from "@src/interfaces/RequestWithUser.js";
import { ReadBankService } from "../services/read.service.js";
import { BankInterface } from "../entities/bank.entity.js";

export const archive = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const session = db.startSession();

    db.startTransaction();

    const readBankService = new ReadBankService(db);
    (await readBankService.handle(req.params.id)) as BankInterface;

    const archiveBankService = new ArchiveBankService(db);
    await archiveBankService.handle(req.params.id, { archivedBy_id: req.user?._id }, session);

    await db.commitTransaction();

    res.status(204).json();
  } catch (error) {
    await db.abortTransaction();
    next(error);
  } finally {
    await db.endSession();
  }
};
