import { NextFunction, Request, Response } from "express";
import { BankInterface } from "../entities/bank.entity.js";
import { ReadBankService } from "../services/read.service.js";
import { db } from "@src/database/database.js";

export const read = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const readBankService = new ReadBankService(db);
    const result = (await readBankService.handle(req.params.id)) as BankInterface;

    res.status(200).json({
      _id: result._id,
      name: result.name,
      createdBy_id: result.createdBy_id,
      createdAt: result.createdAt,
    });
  } catch (error) {
    next(error);
  }
};
