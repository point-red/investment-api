import { NextFunction, Request, Response } from "express";
import { OwnerInterface } from "../entities/owner.entity.js";
import { ReadOwnerService } from "../services/read.service.js";
import { db } from "@src/database/database.js";

export const read = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const readOwnerService = new ReadOwnerService(db);
    const result = (await readOwnerService.handle(req.params.id)) as OwnerInterface;

    res.status(200).json({
      _id: result._id,
      name: result.name,
      createdBy_id: result.createdBy_id
    });
  } catch (error) {
    next(error);
  }
};
