import { NextFunction, Response } from "express";
import { db } from "@src/database/database.js";
import RequestWithUser from "@src/interfaces/RequestWithUser.js";
import { ReadDepositService } from "@src/modules/deposits/services/read.service.js";
import {
  CreateDepositInterface,
  DepositInterface,
} from "@src/modules/deposits/entities/deposit.entitiy.js";
import { UpdateDepositService } from "@src/modules/deposits/services/update.service.js";
import { validate } from "@src/modules/deposits/request/create.request.js";
import { CalculateDepositService } from "@src/modules/deposits/services/calculate.service.js";

export const update = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const session = db.startSession();

    db.startTransaction();

    validate(req.body);

    const readDepositService = new ReadDepositService(db);
    const deposit = (await readDepositService.handle(
      req.params.id
    )) as DepositInterface;

    const calculate = new CalculateDepositService();
    const data: CreateDepositInterface = await calculate.calculate(
      req.body,
      deposit
    );

    const updateDepositService = new UpdateDepositService(db);
    await updateDepositService.handle(
      req.params.id,
      {
        ...data,
        updatedBy: {
          _id: req.user?._id,
          name: req.user?.name,
          username: req.user?.username,
        },
      },
      session
    );

    await db.commitTransaction();

    const readDeposit = new ReadDepositService(db);
    const result = (await readDeposit.handle(
      req.params.id
    )) as DepositInterface;
    res.status(200).json({
      ...result,
    });
  } catch (error) {
    await db.abortTransaction();
    next(error);
  } finally {
    await db.endSession();
  }
};
