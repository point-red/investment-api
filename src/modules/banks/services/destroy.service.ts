import { BankRepository } from "../repositories/bank.repository.js";
import DatabaseConnection, { DeleteOptionsInterface } from "@src/database/connection.js";

export class DestroyBankService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(id: string, options: DeleteOptionsInterface) {
    const bankRepository = new BankRepository(this.db);
    const response = await bankRepository.delete(id, options);
    return;
  }
}
