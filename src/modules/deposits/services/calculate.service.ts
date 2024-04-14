import { QueryInterface } from "@src/database/connection.js";
import {
  CreateDepositInterface,
  DepositInterface,
} from "@src/modules/deposits/entities/deposit.entitiy.js";
import { format } from "date-fns";
import { padWithZero } from "@src/utils/string.js";
import { addDay } from "@src/utils/date.js";
import { ReadManyDepositService } from "@src/modules/deposits/services/read-many.service.js";
import { db } from "@src/database/database.js";

export class CalculateDepositService {
  public async calculate(body: DepositInterface, entity?: DepositInterface) {
    let data: CreateDepositInterface = {
      ...body,
    };

    let date = new Date(data.date.replace(/(\d+[/])(\d+[/])/, "$2$1"));
    data.date = date.toISOString();
    if (!entity) {
      const readMany = new ReadManyDepositService(db);
      const iQuery: QueryInterface = {
        fields: "number",
        filter: {},
        search: { date: `${format(date, "yyyy-MM")}` },
        page: 1,
        pageSize: 1,
        sort: {},
      };

      const deposits = await readMany.handle(iQuery);
      const documentCount = deposits.pagination.totalDocument;

      data.number = `DP/${format(date, "MM")}/${format(
        date,
        "yyyy"
      )}/${padWithZero(documentCount + 1, 3)}`;
    }

    data.remaining = data.amount;
    data.baseInterest = Math.floor(
      (data.amount * (data.interestRate / 100)) / data.baseDate
    );
    data.dueDate = addDay(date, data.tenor).toISOString();
    data.grossInterest = data.baseInterest * data.tenor;
    data.taxAmount = Math.floor(data.grossInterest * (data.taxRate / 100));
    data.netInterest = data.grossInterest - data.taxAmount;

    let lastDueDate = new Date(data.date);
    const returns = data.returns.sort((a, b) => a.baseDays - b.baseDays);
    for (const ret of returns) {
      lastDueDate = addDay(lastDueDate, ret.baseDays);
      ret.dueDate = lastDueDate.toISOString();
      ret.gross = data.baseInterest * ret.baseDays;
      ret.taxAmount = Math.floor(ret.gross * (data.taxRate / 100));
      ret.net = ret.gross - ret.taxAmount;
    }

    if (data.cashbacks) {
      for (const cashback of data.cashbacks) {
        cashback.amount = Math.floor(data.amount * (cashback.rate / 100));
        cashback.remaining = cashback.amount;
      }
    }

    return data;
  }
}
