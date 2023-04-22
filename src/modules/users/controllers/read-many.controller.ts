import { NextFunction, Request, Response } from "express";
import { ReadManyUserService } from "../services/read-many.service.js";
import { QueryInterface } from "@src/database/connection.js";
import { db } from "@src/database/database.js";

export const readMany = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const readManyUserService = new ReadManyUserService(db);

    const query: QueryInterface = {
      fields: (req.query.fields as string) ?? "",
      restrictedFields: ["password"],
      includes: (req.query.includes as string) ?? "",
      archived: (req.query.archived as unknown as boolean) ?? false,
      filter: (req.query.filter as any) ?? {},
      search: (req.query.search as any) ?? {},
      page: Number(req.query.page ?? 1),
      pageSize: Number(req.query.limit ?? 10),
      sort: (req.query.sort as any) ?? {},
    };

    let costumeFilter = {};
    if (query.archived) {
      costumeFilter = { archivedBy_id: { $exists: true } };
    } else {
      costumeFilter = { archivedBy_id: { $exists: false } };
    }

    query.filter = { ...query.filter, ...costumeFilter };

    const result = await readManyUserService.handle(query);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
