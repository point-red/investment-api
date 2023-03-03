import { NextFunction, Request, Response } from "express";
import { validate } from "../request/delete-reject.request.js";
import { RequestDeleteRejectOwnerService } from "../services/request-delete-reject.service.js";
import { db } from "@src/database/database.js";

export const requestDeleteReject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = db.startSession();

    db.startTransaction();

    validate(req.body);

    const requestDeleteRejectOwnerService = new RequestDeleteRejectOwnerService(db);
    await requestDeleteRejectOwnerService.handle(req.params.id, req.body, session);

    await db.commitTransaction();

    res.status(204).json();
  } catch (error) {
    await db.abortTransaction();
    next(error);
  } finally {
    await db.endSession();
  }
};
