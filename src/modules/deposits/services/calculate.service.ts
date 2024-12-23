import { format } from "date-fns";
import { DepositRepository } from "../repositories/deposit.repository.js";
import { QueryInterface } from "@src/database/connection.js";
import { db } from "@src/database/database.js";
import { CreateDepositInterface, DepositInterface } from "@src/modules/deposits/entities/deposit.entitiy.js";
import { ReadManyDepositService } from "@src/modules/deposits/services/read-many.service.js";
import { addDay } from "@src/utils/date.js";
import { padWithZero } from "@src/utils/string.js";

export class CalculateDepositService {
  public async calculate(body: DepositInterface, entity?: DepositInterface) {
    const data: CreateDepositInterface = {
      ...body,
    };

    const date = new Date(data.date.replace(/(\d+[/])(\d+[/])/, "$2$1")).toISOString();
    data.date = format(data.date.replace(/(\d+[/])(\d+[/])/, "$2$1"), "yyyy-MM-dd");
    if (!entity) {
      const iQuery: QueryInterface = {
        fields: "number",
        filter: {},
        search: { date: `${format(date, "yyyy-MM")}` },
        page: 1,
        pageSize: 1,
        sort: {},
      };

      const depositRepository = new DepositRepository(db);
      const deposits = await depositRepository.readMany(iQuery);
      const documentCount = deposits.pagination.totalDocument;

      data.number = `DP/${format(date, "MM")}/${format(date, "yyyy")}/${padWithZero(documentCount + 1, 3)}`;
    }

    data.remaining = data.amount;
    data.baseInterest = data.baseInterest;
    data.dueDate = format(addDay(date, data.tenor).toISOString(), "yyyy-MM-dd");
    data.grossInterest = data.baseInterest * data.tenor;
    data.taxAmount = Math.floor(data.grossInterest * (data.taxRate / 100));
    data.netInterest = data.grossInterest - data.taxAmount;

    let lastDueDate = new Date(data.date);
    let totalReturn = 0;

    if (data.returns && data.returns.length > 0) {
      const returns = data.returns.sort((a, b) => a.baseDays - b.baseDays);
      for (const ret of returns) {
        lastDueDate = addDay(lastDueDate.toISOString(), ret.baseDays);
        ret.dueDate = lastDueDate.toISOString();
        ret.gross = data.baseInterest * ret.baseDays;
        ret.taxAmount = Math.floor(ret.gross * (data.taxRate / 100));
        ret.net = ret.gross - ret.taxAmount;
        totalReturn += Number(ret.net);
      }

      if (totalReturn != data.netInterest) {
        data.formStatus = "draft";
      }
    }

    if (typeof data.isRollOver === "string") {
      if (data.isRollOver === "false") {
        data.isRollOver = false;
      } else {
        data.isRollOver = true;
      }
    }

    if (!data.isRollOver) {
      if (!data.returns || data.returns.length == 0) {
        data.formStatus = "draft";
      }
    } else {
      data.returns = [];
    }

    if (typeof data.isCashback === "string") {
      if (data.isCashback === "false") {
        data.isCashback = false;
      } else {
        data.isCashback = true;
      }
    }

    if (data.isCashback) {
      if (!data.cashbacks || data.cashbacks.length == 0) {
        data.formStatus = "draft";
      }
    } else {
      data.cashbacks = [];
    }

    return data;
  }
}
