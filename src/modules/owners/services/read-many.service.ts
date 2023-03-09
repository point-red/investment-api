import { OwnerInterface } from "../entities/owner.entity.js";
import { OwnerRepository } from "../repositories/owner.repository.js";
import DatabaseConnection, { QueryInterface } from "@src/database/connection.js";

export class ReadManyOwnerService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(query: QueryInterface) {
    const ownerRepository = new OwnerRepository(this.db);
    const result = await ownerRepository.readMany(query);

    return {
      owners: result.data as unknown as Array<OwnerInterface>,
      pagination: result.pagination,
    };
  }
}
