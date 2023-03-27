import { NextFunction, Request, Response } from "express";
import { DestroyOwnerService } from "../services/destroy.service.js";
import { db } from "@src/database/database.js";
import { ReadOwnerService } from "../services/read.service.js";
import { OwnerInterface } from "../entities/owner.entity.js";

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = db.startSession();

    db.startTransaction();

    const readOwnerService = new ReadOwnerService(db);
    (await readOwnerService.handle(req.params.id)) as OwnerInterface;

    const destroyOwnerService = new DestroyOwnerService(db);
    await destroyOwnerService.handle(req.params.id, { session });

    await db.commitTransaction();

    res.status(204).json();
  } catch (error) {
    await db.abortTransaction();
    next(error);
  } finally {
    await db.endSession();
  }
};
