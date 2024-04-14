import { NextFunction, Response } from "express";
import { validate } from "../request/renewal.request.js";
import { db } from "@src/database/database.js";
import RequestWithUser from "@src/interfaces/RequestWithUser.js";
import {
  CreateDepositInterface,
  DepositInterface,
} from "@src/modules/deposits/entities/deposit.entitiy.js";
import { ReadDepositService } from "@src/modules/deposits/services/read.service.js";
import { CalculateDepositService } from "@src/modules/deposits/services/calculate.service.js";
import { RenewalService } from "@src/modules/deposits/services/renewal.service.js";

export const renewal = async (
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

    const calculate = new CalculateDepositService();
    const data: CreateDepositInterface = await calculate.calculate(req.body);
    const renewalService = new RenewalService(db);

    const result = await renewalService.handle(
      req.params.id,
      {
        ...data,
        createdBy: {
          _id: req.user?._id,
          name: req.user?.name,
          username: req.user?.username,
        },
      },
      session
    );

    await db.commitTransaction();

    const readDeposit = new ReadDepositService(db);
    const deposit = (await readDeposit.handle(result._id)) as DepositInterface;
    res.status(201).json({
      ...deposit,
    });
  } catch (error) {
    await db.abortTransaction();
    next(error);
  } finally {
    await db.endSession();
  }
};
