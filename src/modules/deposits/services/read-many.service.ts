import DatabaseConnection, {
  QueryInterface,
} from "@src/database/connection.js";
import { DepositRepository } from "@src/modules/deposits/repositories/deposit.repository.js";
import { DepositInterface } from "@src/modules/deposits/entities/deposit.entitiy.js";

export class ReadManyDepositService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(query: QueryInterface) {
    const depositRepository = new DepositRepository(this.db);
    const result = await depositRepository.readMany(query);

    return {
      deposits: result.data as unknown as Array<DepositInterface>,
      pagination: result.pagination,
    };
  }
}
