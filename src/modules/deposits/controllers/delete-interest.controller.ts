import { NextFunction, Response } from "express";
import { db } from "@src/database/database.js";
import { ReadDepositService } from "@src/modules/deposits/services/read.service.js";
import { DepositInterface } from "@src/modules/deposits/entities/deposit.entitiy.js";
import RequestWithUser from "@src/interfaces/RequestWithUser.js";
import { validate } from "../request/delete.request.js";
import { DeleteInterestService } from "@src/modules/deposits/services/delete-interest.service.js";

export const destroyInterest = async (
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

    const deleteInterestService = new DeleteInterestService(db);

    await deleteInterestService.handle(
      req.params.id,
      {
        ...req.body,
        deletedBy: {
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
