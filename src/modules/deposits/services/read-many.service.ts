import { format } from "date-fns";
import DatabaseConnection, {
  DocumentInterface,
  QueryInterface,
  ReadManyResultInterface,
} from "@src/database/connection.js";
import { DepositRepository } from "@src/modules/deposits/repositories/deposit.repository.js";
import { DepositInterface } from "@src/modules/deposits/entities/deposit.entitiy.js";

export class ReadManyDepositService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(query: QueryInterface) {
    query.filter["index"] = 0
    const match = [];
    if (query.filter['dateFrom'] && query.filter['dateTo'] && query.filter['dueDateTo'] && query.filter['dueDateFrom']) {
      try {
        const dateFrom = format(query.filter['dateFrom'].replace(/(\d+[/])(\d+[/])/, "$2$1"), "yyyy-MM-dd");
        const dateTo = format(query.filter['dateTo'].replace(/(\d+[/])(\d+[/])/, "$2$1"), "yyyy-MM-dd");
        const dueDateFrom = format(query.filter['dueDateFrom'].replace(/(\d+[/])(\d+[/])/, "$2$1"), "yyyy-MM-dd");
        const dueDateTo = format(query.filter['dueDateTo'].replace(/(\d+[/])(\d+[/])/, "$2$1"), "yyyy-MM-dd");
        delete query.filter['dateFrom']
        delete query.filter['dateTo']
        delete query.filter['dueDateTo']
        delete query.filter['dueDateFrom']
        match.push({
          $or: [
            { date: { $gte: dateFrom, $lte: dateTo } },
            { deuDate: { $gte: dueDateFrom, $lte: dueDateTo } },
          ],
        });
      } catch (e) {}
    } else if (query.filter['dateFrom'] && query.filter['dateTo']) {
      try {
        const dateFrom = format(query.filter['dateFrom'].replace(/(\d+[/])(\d+[/])/, "$2$1"), "yyyy-MM-dd");
        const dateTo = format(query.filter['dateTo'].replace(/(\d+[/])(\d+[/])/, "$2$1"), "yyyy-MM-dd");
        delete query.filter['dateFrom']
        delete query.filter['dateTo']
        match.push({ date: { $gte: dateFrom, $lte: dateTo } });
      } catch (e) {}
    } else if (query.filter['dueDateTo'] && query.filter['dueDateFrom']) {
      const dueDateFrom = format(query.filter['dueDateFrom'].replace(/(\d+[/])(\d+[/])/, "$2$1"), "yyyy-MM-dd");
      const dueDateTo = format(query.filter['dueDateTo'].replace(/(\d+[/])(\d+[/])/, "$2$1"), "yyyy-MM-dd");
      delete query.filter['dueDateTo']
      delete query.filter['dueDateFrom']
      match.push({ dueDate: { $gte: dueDateFrom, $lte: dueDateTo } });
    }

    if (query.filter["cashbackPayment"]) {
      try {
        if (query.filter["cashbackPayment"] == "incomplete") {
          delete query.filter["cashbackPayment"];
          query.filter = {
            ...query.filter,
            $or: [
              { cashbackPayment: { $exists: false } },
              { "cashbackPayment.status": "incomplete" },
            ],
          };
        } else {
          query.filter["cashbackPayment.status"] = query.filter["cashbackPayment"];
          delete query.filter["cashbackPayment"]
        }
      } catch (e) { }
    }
    if (query.filter["interestPayment"]) {
      try {
        if (query.filter["interestPayment"] == "incomplete") {
          delete query.filter["interestPayment"];
          query.filter = {
            ...query.filter,
            $or: [
              { interestPayment: { $exists: false } },
              { "interestPayment.status": "incomplete" },
            ],
          };
        } else {
          query.filter["interestPayment.status"] = query.filter["interestPayment"];
          delete query.filter["interestPayment"]
        }
      } catch (e) { }
    }
    if (query.filter["withdrawals"]) {
      try {
        if (query.filter["withdrawals"] == "incomplete") {
          delete query.filter["withdrawals"];
          query.filter = {
            ...query.filter,
            $or: [
              { remaining: { $gt: 0 } },
              { remaining: { $ne: '0' } },
            ],
          };
        } else {
          delete query.filter["withdrawals"];
          query.filter = {
            ...query.filter,
            $or: [
              { remaining: 0 },
              { remaining: '0' },
            ],
          };
        }
      } catch (e) { }
    }
    if (query.filter["isRollOver"]) {
      try {
        query.filter["isRollOver"] = Boolean(
          query.filter["isRollOver"] === true || query.filter["isRollOver"] === 'true'
        );
      } catch (e) { }
    }
    if (query.filter["isCashback"]) {
      try {
        query.filter["isCashback"] = Boolean(
          query.filter["isCashback"] === true || query.filter["isCashback"] === 'true'
        );
      } catch (e) { }
    }

    let costumeFilter = {};
    if (query.filter["renewalStatus"]) {
      try {
        if (query.filter["renewalStatus"] == 'complete') {
          query.filter['renewal_id'] = { $exists: true };
        } else if (query.filter["renewalStatus"] == 'incomplete') {
          query.filter['renewal_id'] = { $exists: false };
        }
        delete query.filter["renewalStatus"]
      } catch (e) { }
    }

    if (query.archived) {
      costumeFilter = { deletedBy: { $exists: true } };
    } else {
      costumeFilter = { deletedBy: { $exists: false } };
    }

    query.filter = {
      ...query.filter,
      ...costumeFilter
    };

    for (const key in query.filter) {
      match.push({ [key]: query.filter[key] })
    }

    let searchArr = [];
    if (query.search) {
      for (const key in query.search) {
        const regexPattern = new RegExp(query.search[key], 'i'); // Case insensitive regex
        const regexQuery = {
          $expr: {
            $regexMatch: {
              input: { $toString: `$${key}` }, // Convert field to a string for regex matching
              regex: regexPattern
            }
          }
        };
        searchArr.push(regexQuery);
      }
      if (searchArr.length > 0) {
        match.push({ $or: searchArr });
      }
    }

    let querySort: any = {};
    if (query.sort) {
      for (const key in query.sort) {
        querySort[key] = query.sort[key] === "desc" ? -1 : 1;
      }
    }

    // const pipeline = [
    //   ...(match.length > 0
    //     ? [
    //       {
    //         $match: {
    //           $and: match,
    //         },
    //       },
    //     ]
    //     : []),
    //     {
    //       $sort: querySort
    //     },
    //   {
    //     $group: {
    //       _id: "$bilyetNumber",
    //       deposits: { $push: "$$ROOT" }
    //     }
    //   },
    //   {
    //     $project: {
    //       _id: 0, 
    //       bilyetNumber: "$_id", 
    //       deposits: 1
    //     }
    //   }
    // ];

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
        $sort: querySort
      },
      {
        $group: {
          _id: '$bilyetNumber',
          deposits: { $first: '$$ROOT' }
        }
      },
      {
        $replaceRoot: { newRoot: '$deposits' }
      },
      {
        $sort: querySort
      },
      // {
      //   $graphLookup: {
      //     from: 'deposits',
      //     startWith: '$deposit.renewal_id',
      //     connectFromField: 'deposit.renewal_idyour',
      //     connectToField: 'deposit_id',
      //     as: 'childs',
      //   }
      // }
    ];

    const depositRepository = new DepositRepository(this.db);
    const result = await depositRepository.aggregate(pipeline, query) as ReadManyResultInterface;

    for (const deposit of result.data) {
      query.page = 1
      query.pageSize = 100
      query.filter = {
        ...query.filter,
        bilyetNumber: deposit.bilyetNumber,
        index: { $gt: deposit.index }
      };
      const renewals = await depositRepository.readMany(query)
      deposit['renewals'] = renewals.data
    }

    return {
      deposits: result.data as unknown as Array<DepositInterface>,
      pagination: result.pagination,
    };
  }
}
