import { ObjectId } from "mongodb";
import { UserRepository } from "../repositories/user.repository.js";
import DatabaseConnection from "@src/database/connection.js";
import { fields } from "@src/database/mongodb-util.js";

export class ReadUserService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(
    id: string,
    filter: any = {
      fields: "",
      filter: {},
      restrictedFields: [],
      page: 1,
      pageSize: 1,
      sort: {},
    }
  ) {
    const userRepository = new UserRepository(this.db);

    const aggregates: any = [
      {
        $match: {
          _id: new ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "roles",
          localField: "role_id",
          foreignField: "_id",
          as: "role",
        },
      },
      {
        $set: {
          role: {
            $arrayElemAt: ["$role", 0],
          },
        },
      },
      { $limit: 1 },
    ];

    if (filter && filter.fields) {
      aggregates.push({ $project: fields(filter.fields) });
    }

    const aggregateResult = userRepository.aggregate(aggregates, filter);

    const result = (await aggregateResult) as any;

    return result.data[0];
  }
}
