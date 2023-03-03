import { NextFunction, Request, Response } from "express";
import { validate } from "../request/request-delete.request.js";
import { RequestDeleteOwnerService } from "../services/request-delete.service.js";
import { db } from "@src/database/database.js";

export const requestDelete = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = db.startSession();

    db.startTransaction();

    validate(req.body);

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
