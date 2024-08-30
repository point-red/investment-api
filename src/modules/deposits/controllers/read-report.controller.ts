import { NextFunction, Request, Response } from "express";
import { ReadReportService } from "../services/read-report.service.js";
import { QueryInterface } from "@src/database/connection.js";
import { db } from "@src/database/database.js";
import { DepositInterface } from "@src/modules/deposits/entities/deposit.entitiy.js";

export interface PaginationInterface {
  page: number;
  pageCount: number;
  pageSize: number;
  totalDocument: number;
}

export interface ResponseInterface {
  deposits: Array<DepositInterface>;
  pagination: PaginationInterface;
}

export const readReports = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const readReportService = new ReadReportService(db);

    const iQuery: QueryInterface = {
      fields: (req.query.field as string) ?? "",
      filter: (req.query.filter as any) ?? {},
      archived: (req.query.archived as unknown as boolean) ?? false,
      page: Number(req.query.page ?? 1),
      pageSize: Number(req.query.pageSize ?? 10),
      sort: (req.query.sort as any) ?? {},
    };

    const result = await readReportService.handle(iQuery);

    const pagination: PaginationInterface = {
      page: result.pagination.page,
      pageSize: result.pagination.pageSize,
      pageCount: result.pagination.pageCount,
      totalDocument: result.pagination.totalDocument,
    };

    const response: ResponseInterface = {
      deposits: result.deposits,
      pagination: pagination,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};