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

    if (iQuery.filter["cashbackPayment"]) {
      try {
        if (iQuery.filter["cashbackPayment"] == "incomplete") {
          delete iQuery.filter["cashbackPayment"];
          iQuery.filter = {
            ...iQuery.filter,
            $or: [
              { cashbackPayment: { $exists: false } },
              { "cashbackPayment.status": "incomplete" },
            ],
          };
        } else {
          iQuery.filter["cashbackPayment.status"] = iQuery.filter["cashbackPayment"];
          delete iQuery.filter["cashbackPayment"]
        }
      } catch (e) {}
    }
    if (iQuery.filter["interestPayment"]) {
      try {
        if (iQuery.filter["interestPayment"] == "incomplete") {
          delete iQuery.filter["interestPayment"];
          iQuery.filter = {
            ...iQuery.filter,
            $or: [
              { interestPayment: { $exists: false } },
              { "interestPayment.status": "incomplete" },
            ],
          };
        } else {
          iQuery.filter["interestPayment.status"] = iQuery.filter["interestPayment"];
          delete iQuery.filter["interestPayment"]
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

    let costumeFilter = {};
    if (iQuery.archived) {
      costumeFilter = { deletedBy: { $exists: true } };
    } else {
      costumeFilter = { deletedBy: { $exists: false } };
    }

    iQuery.filter = {
      ...iQuery.filter,
      ...costumeFilter 
    };

    console.log(iQuery.filter)

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
