import { ObjectId } from "mongodb";
import { BankEntity } from "../entities/bank.entity.js";
import { BankRepository } from "../repositories/bank.repository.js"
import DatabaseConnection, { DocumentInterface } from "@src/database/connection.js";

export class ArchiveBankService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(id: string, doc: DocumentInterface, session: unknown) {
    const bankEntity = new BankEntity({
      archivedBy_id: new ObjectId(doc.archivedBy_id),
      archivedAt: new Date()
    });

    const bankRepository = new BankRepository(this.db);
    return await bankRepository.update(id, bankEntity.bank, { session });
  }
}
