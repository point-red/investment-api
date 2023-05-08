import { hasOne } from "../entities/user.entity.js";
import { UserRepository } from "../repositories/user.repository.js";
import DatabaseConnection, { DocumentInterface, QueryInterface } from "@src/database/connection.js";
import { fields } from "@src/database/mongodb-util.js";

export class ReadManyUserService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(query: QueryInterface) {
    const userRepository = new UserRepository(this.db);

    if (query.includes) {
      const aggregates: any = [];
      const includes = query.includes.split(";");
      let addField = {};

      for (const key of includes) {
        if (hasOne.hasOwnProperty(key)) {
          const lookup = {
            $lookup: hasOne[key],
          };
          aggregates.push(lookup);
          addField = { ...addField, [key]: { $arrayElemAt: [`$${key}`, 0] } };
        }
      }

      if (addField) {
        aggregates.push({ $addFields: addField });
      }

      if (query && query.filter) {
        let search = {};
        if (query.search) {
          for (const key in query.search) {
            search = { ...search, [key]: { $regex: query.search[key], $options: "i" } };
          }
        }
        aggregates.push({ $match: { ...query.filter, ...search } });
      }

      if (query && query.fields) {
        aggregates.push({ $project: fields(query.fields) });
      }

      if (query && query.restrictedFields) {
        aggregates.push({ $unset: query.restrictedFields });
      }

      if (query && Object.keys(query.sort).length > 0) {
        let querySort = {};
        if (query.sort) {
          for (const key in query.sort) {
            if (query.sort[key] === "desc") {
              querySort = { ...querySort, [key]: -1 };
            } else {
              querySort = { ...querySort, [key]: 1 };
            }
          }
          aggregates.push({ $sort: querySort });
        }
      }

      return await userRepository.aggregate(aggregates, { page: query.page, pageSize: query.pageSize });
    }
    return await userRepository.readMany(query);
  }
}
