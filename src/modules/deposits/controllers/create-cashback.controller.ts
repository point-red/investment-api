import { NextFunction, Response } from "express";
import { validate } from "../request/create-cashback.request.js";
import { db } from "@src/database/database.js";
import RequestWithUser from "@src/interfaces/RequestWithUser.js";
import { DepositInterface } from "@src/modules/deposits/entities/deposit.entitiy.js";
import { ReadDepositService } from "@src/modules/deposits/services/read.service.js";
import { CreateCashbackService } from "@src/modules/deposits/services/create-cashback.service.js";

export const createCashback = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const session = db.startSession();

    db.startTransaction();

    validate(req.body);

    const readDepositService = new ReadDepositService(db);
    (await readDepositService.handle(req.params.id)) as DepositInterface;

    const createDepositService = new CreateCashbackService(db);

    await createDepositService.handle(
      req.params.id,
      {
        ...req.body,
        user: {
          _id: req.user?._id,
          name: req.user?.name,
          username: req.user?.username,
        },
      },
      session
    );

    await db.commitTransaction();

    res.status(204).json();
  } catch (error) {
    await db.abortTransaction();
    next(error);
  } finally {
    await db.endSession();
  }
};
