import { BankEntity } from "../entities/bank.entity.js";
import { BankRepository } from "../repositories/bank.repository.js"
import DatabaseConnection from "@src/database/connection.js";

export class ArchiveBankService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(id: string, session: unknown) {
    const bankEntity = new BankEntity({
      archivedAt: new Date()
    });

    const bankRepository = new BankRepository(this.db);
    return await bankRepository.update(id, bankEntity.bank, { session });
  }
}
