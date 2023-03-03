import { NextFunction, Request, Response } from "express";
import { BankInterface } from "../entities/bank.entity.js";
import { ReadManyBankService } from "../services/read-many.service.js";
import { QueryInterface } from "@src/database/connection.js";
import { db } from "@src/database/database.js";

export interface PaginationInterface {
  page: number;
  pageCount: number;
  pageSize: number;
  totalDocument: number;
}

export interface ResponseInterface {
  banks: Array<BankInterface>;
  pagination: PaginationInterface;
}

export const readMany = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const readManyBankService = new ReadManyBankService(db);

    const iQuery: QueryInterface = {
      fields: (req.query.field as string) ?? "",
      filter: (req.query.filter as any) ?? {},
      page: Number(req.query.page ?? 1),
      pageSize: Number(req.query.pageSize ?? 10),
      sort: (req.query.sort as string) ?? "",
    };

    const result = await readManyBankService.handle(iQuery);

    const pagination: PaginationInterface = {
      page: result.pagination.page,
      pageSize: result.pagination.pageSize,
      pageCount: result.pagination.pageCount,
      totalDocument: result.pagination.totalDocument,
    };

    const response: ResponseInterface = {
      banks: result.banks,
      pagination: pagination,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
