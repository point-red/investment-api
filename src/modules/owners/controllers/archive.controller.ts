import { NextFunction, Response } from "express";
import { ArchiveOwnerService } from "../services/archive.service.js";
import { db } from "@src/database/database.js";
import RequestWithUser from "@src/interfaces/RequestWithUser.js";
import { ReadOwnerService } from "../services/read.service.js";
import { OwnerInterface } from "../entities/owner.entity.js";

export const archive = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const session = db.startSession();

    db.startTransaction();

    const readOwnerService = new ReadOwnerService(db);
    (await readOwnerService.handle(req.params.id)) as OwnerInterface;

    const archiveOwnerService = new ArchiveOwnerService(db);
    await archiveOwnerService.handle(req.params.id, { archivedBy_id: req.user?._id }, session);

    await db.commitTransaction();

    res.status(204).json();
  } catch (error) {
    await db.abortTransaction();
    next(error);
  } finally {
    await db.endSession();
  }
};
