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

    let date = new Date(data.date);
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
    data.baseInterest =
      (data.amount * (data.interestRate / 100)) / data.baseDate;
    data.dueDate = addDay(date, data.tenor).toISOString();
    data.grossInterest = data.baseInterest * data.tenor;
    data.taxAmount = data.grossInterest * (data.taxRate / 100);
    data.netInterest = data.grossInterest - data.taxAmount;

    let lastDueDate = new Date(data.date);
    const interests = data.interests.sort((a, b) => a.baseDays - b.baseDays);
    for (const interest of interests) {
      lastDueDate = addDay(lastDueDate, interest.baseDays);
      interest.dueDate = lastDueDate.toISOString();
      interest.gross = data.baseInterest * interest.baseDays;
      interest.taxAmount = interest.gross * (data.taxRate / 100);
      interest.net = interest.gross - interest.taxAmount;
    }

    if (data.cashbacks) {
      for (const cashback of data.cashbacks) {
        cashback.amount = data.amount * (cashback.rate / 100);
        cashback.remaining = cashback.amount;
      }
    }

    return data;
  }
}
