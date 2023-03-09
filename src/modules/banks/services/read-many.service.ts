import { BankInterface } from "../entities/bank.entity.js";
import { BankRepository } from "../repositories/bank.repository.js";
import DatabaseConnection, { QueryInterface } from "@src/database/connection.js";

export class ReadManyBankService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(query: QueryInterface) {
    const bankRepository = new BankRepository(this.db);
    const result = await bankRepository.readMany(query);

    return {
      banks: result.data as unknown as Array<BankInterface>,
      pagination: result.pagination,
    };
  }
}
