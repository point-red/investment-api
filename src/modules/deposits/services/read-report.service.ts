import { format } from "date-fns";
import DatabaseConnection, { QueryInterface, ReadManyResultInterface } from "@src/database/connection.js";
import { DepositInterface } from "@src/modules/deposits/entities/deposit.entitiy.js";
import { DepositRepository } from "@src/modules/deposits/repositories/deposit.repository.js";

export class ReadReportService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(query: QueryInterface) {
    const match = [];
    if (
      query.filter["dateFrom"] &&
      query.filter["dateTo"] &&
      query.filter["dueDateTo"] &&
      query.filter["dueDateFrom"]
    ) {
      try {
        const dateFrom = format(query.filter["dateFrom"].replace(/(\d+[/])(\d+[/])/, "$2$1"), "yyyy-MM-dd");
        const dateTo = format(query.filter["dateTo"].replace(/(\d+[/])(\d+[/])/, "$2$1"), "yyyy-MM-dd");
        const dueDateFrom = format(query.filter["dueDateFrom"].replace(/(\d+[/])(\d+[/])/, "$2$1"), "yyyy-MM-dd");
        const dueDateTo = format(query.filter["dueDateTo"].replace(/(\d+[/])(\d+[/])/, "$2$1"), "yyyy-MM-dd");
        delete query.filter["dateFrom"];
        delete query.filter["dateTo"];
        delete query.filter["dueDateTo"];
        delete query.filter["dueDateFrom"];
        match.push({
          $or: [{ date: { $gte: dateFrom, $lte: dateTo } }, { deuDate: { $gte: dueDateFrom, $lte: dueDateTo } }],
        });
      } catch (e) {}
    } else if (query.filter["dateFrom"] && query.filter["dateTo"]) {
      try {
        const dateFrom = format(query.filter["dateFrom"].replace(/(\d+[/])(\d+[/])/, "$2$1"), "yyyy-MM-dd");
        const dateTo = format(query.filter["dateTo"].replace(/(\d+[/])(\d+[/])/, "$2$1"), "yyyy-MM-dd");
        delete query.filter["dateFrom"];
        delete query.filter["dateTo"];
        match.push({ date: { $gte: dateFrom, $lte: dateTo } });
      } catch (e) {}
    } else if (query.filter["dueDateTo"] && query.filter["dueDateFrom"]) {
      const dueDateFrom = format(query.filter["dueDateFrom"].replace(/(\d+[/])(\d+[/])/, "$2$1"), "yyyy-MM-dd");
      const dueDateTo = format(query.filter["dueDateTo"].replace(/(\d+[/])(\d+[/])/, "$2$1"), "yyyy-MM-dd");
      delete query.filter["dueDateTo"];
      delete query.filter["dueDateFrom"];
      match.push({ dueDate: { $gte: dueDateFrom, $lte: dueDateTo } });
    }

    if (query.filter["bank"]) {
      try {
        if (query.filter["bank"] != "all") query.filter["bank.name"] = query.filter["bank"];
        delete query.filter["bank"];
      } catch (e) {}
    }

    if (query.filter["owner"]) {
      try {
        if (query.filter["owner"] != "all") query.filter["owner.name"] = query.filter["owner"];
        delete query.filter["owner"];
      } catch (e) {}
    }

    if (query.filter["placementType"]) {
      try {
        if (query.filter["placementType"] == "all") {
        } else if (query.filter["placementType"] == "active") {
          query.filter = {
            ...query.filter,
            $and: [{ remaining: { $gt: 0 } }, { renewal_id: { $exists: false } }],
          };
        } else if (query.filter["placementType"] == "withdrawn") {
          query.filter["withdrawal"] = { $exists: true };
        } else if (query.filter["placementType"] == "placement") {
          query.filter["deposit_id"] = { $exists: false };
        }
        delete query.filter["placementType"];
      } catch (e) {}
    }

    let costumeFilter = {};
    if (query.archived) {
      costumeFilter = { deletedBy: { $exists: true } };
    } else {
      costumeFilter = { deletedBy: { $exists: false } };
    }

    query.filter = {
      ...query.filter,
      ...costumeFilter,
    };

    for (const key in query.filter) {
      match.push({ [key]: query.filter[key] });
    }

    const querySort: any = {};
    if (query.sort) {
      for (const key in query.sort) {
        querySort[key] = query.sort[key] === "desc" ? -1 : 1;
      }
    }

    const pipeline = [
      ...(match.length > 0
        ? [
            {
              $match: {
                $and: match,
              },
            },
          ]
        : []),
      {
        $sort: querySort,
      },
      //   {
      //     $group: {
      //       _id: "$bilyetNumber",
      //       deposits: { $first: "$$ROOT" },
      //     },
      //   },
      //   {
      //     $replaceRoot: { newRoot: "$deposits" },
      //   },
    ];

    const depositRepository = new DepositRepository(this.db);
    const result = (await depositRepository.aggregate(pipeline, query)) as ReadManyResultInterface;

    return {
      deposits: result.data as unknown as Array<DepositInterface>,
      pagination: result.pagination,
    };
  }
}
