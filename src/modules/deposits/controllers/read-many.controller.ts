import { NextFunction, Request, Response } from "express";
import { QueryInterface } from "@src/database/connection.js";
import { db } from "@src/database/database.js";
import { DepositInterface } from "@src/modules/deposits/entities/deposit.entitiy.js";
import { ReadManyDepositService } from "@src/modules/deposits/services/read-many.service.js";

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

export const readMany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const readManyDepositService = new ReadManyDepositService(db);

    const iQuery: QueryInterface = {
      fields: (req.query.field as string) ?? "",
      filter: (req.query.filter as any) ?? {},
      archived: (req.query.archived as unknown as boolean) ?? false,
      search: (req.query.search as any) ?? {},
      page: Number(req.query.page ?? 1),
      pageSize: Number(req.query.pageSize ?? 10),
      sort: (req.query.sort as any) ?? {},
    };

    if (iQuery.filter["cashbackPayments"]) {
      try {
        if (iQuery.filter["cashbackPayments"] == "incomplete") {
          delete iQuery.filter["cashbackPayments"];
          iQuery.filter = {
            ...iQuery.filter,
            $or: [
              { cashbackPayments: { $exists: false } },
              { cashbackPayments: { $size: 0 } },
              { "cashbackPayments.status": "incomplete" },
            ],
          };
        } else {
          iQuery.filter["cashbackPayments"] = {
            $elemMatch: { status: iQuery.filter["cashbackPayments"] },
          };
        }
      } catch (e) {}
    }
    if (iQuery.filter["interestPayments"]) {
      try {
        if (iQuery.filter["interestPayments"] == "incomplete") {
          delete iQuery.filter["interestPayments"];
          iQuery.filter = {
            ...iQuery.filter,
            $or: [
              { interestPayments: { $exists: false } },
              { interestPayments: { $size: 0 } },
              { "interestPayments.status": "incomplete" },
            ],
          };
        } else {
          iQuery.filter["interestPayments"] = {
            $elemMatch: { status: iQuery.filter["interestPayments"] },
          };
        }
      } catch (e) {}
    }
    if (iQuery.filter["withdrawals"]) {
      try {
        if (iQuery.filter["withdrawals"] == "incomplete") {
          delete iQuery.filter["withdrawals"];
          iQuery.filter = {
            ...iQuery.filter,
            $or: [
              { withdrawals: { $exists: false } },
              { withdrawals: { $size: 0 } },
              { "withdrawals.status": "incomplete" },
              { withdrawals: { $elemMatch: { status: "incomplete" } } },
            ],
          };
        } else {
          iQuery.filter["withdrawals"] = {
            $elemMatch: { status: iQuery.filter["withdrawals"] },
          };
        }
      } catch (e) {}
    }
    if (iQuery.filter["isRollOver"]) {
      try {
        iQuery.filter["isRollOver"] = Boolean(
          iQuery.filter["isRollOver"] === true
        );
      } catch (e) {}
    }
    iQuery.filter = {
      ...iQuery.filter,
      deletedBy: { $exists: false },
    };

    const result = await readManyDepositService.handle(iQuery);

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
