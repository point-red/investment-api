import { NextFunction, Request, Response } from "express";
import { RequestDeleteApproveOwnerService } from "../services/request-delete-approve.service.js";
import { db } from "@src/database/database.js";

export const requestDeleteApprove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = db.startSession();

    db.startTransaction();

    const requestDeleteApproveOwnerService = new RequestDeleteApproveOwnerService(db);
    await requestDeleteApproveOwnerService.handle(req.params.id, session);

    await db.commitTransaction();

    res.status(204).json();
  } catch (error) {
    await db.abortTransaction();
    next(error);
  } finally {
    await db.endSession();
  }
};
