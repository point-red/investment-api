import { ApiError } from "@point-hub/express-error-handler";
import { NextFunction, Response } from "express";
import { ObjectId } from "mongodb";
import { DepositRepository } from "../repositories/deposit.repository.js";
import { validate } from "../request/create.request.js";
import { QueryInterface } from "@src/database/connection.js";
import { db } from "@src/database/database.js";
import RequestWithUser from "@src/interfaces/RequestWithUser.js";
import {
  CreateDepositInterface,
  DepositCashbackInterface,
  DepositInterface,
  DepositReturnInterface,
} from "@src/modules/deposits/entities/deposit.entitiy.js";
import { CalculateDepositService } from "@src/modules/deposits/services/calculate.service.js";
import { CreateDepositService } from "@src/modules/deposits/services/create.service.js";
import { ReadDepositService } from "@src/modules/deposits/services/read.service.js";

export const create = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const session = db.startSession();

    db.startTransaction();
    console.log(req.body.baseInterest);
    if (req.body.formStatus === "complete") validate(req.body);

    const iQuery: QueryInterface = {
      fields: "number",
      filter: { bilyetNumber: req.body.bilyetNumber },
      search: {},
      page: 1,
      pageSize: 1,
      sort: {},
    };

    const depositRepository = new DepositRepository(db);
    const deposits = await depositRepository.readMany(iQuery);
    if (deposits.data && deposits.data.length > 0) {
      throw new ApiError(400, { message: "Bilyet Number already exist" });
    }

    const calculate = new CalculateDepositService();
    const data: CreateDepositInterface = await calculate.calculate(req.body);
    console.log(data);
    const createDepositService = new CreateDepositService(db);
    const result = await createDepositService.handle(
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
