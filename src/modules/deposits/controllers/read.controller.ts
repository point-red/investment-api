import { NextFunction, Request, Response } from "express";
import { db } from "@src/database/database.js";
import { ReadDepositService } from "@src/modules/deposits/services/read.service.js";
import { DepositInterface } from "@src/modules/deposits/entities/deposit.entitiy.js";

export const read = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const readDepositService = new ReadDepositService(db);
    const result = (await readDepositService.handle(
      req.params.id
    )) as DepositInterface;

    res.status(200).json({ ...result });
  } catch (error) {
    next(error);
  }
};
