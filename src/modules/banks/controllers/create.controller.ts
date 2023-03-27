import { NextFunction, Response } from "express";
import { validate } from "../request/create.request.js";
import { CreateBankService } from "../services/create.service.js";
import { db } from "@src/database/database.js";
import RequestWithUser from "@src/interfaces/RequestWithUser.js";

export const create = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const session = db.startSession();

    db.startTransaction();

    validate(req.body);

    const createBankService = new CreateBankService(db);
    const result = await createBankService.handle({
      ...req.body, 
      createdBy_id: req.user?._id
    }, session);

    await db.commitTransaction();

    res.status(201).json({
      _id: result._id,
    });
  } catch (error) {
    await db.abortTransaction();
    next(error);
  } finally {
    await db.endSession();
  }
};
