import { BankEntity } from "../entities/bank.entity.js";
import { BankRepository } from "../repositories/bank.repository.js";
import DatabaseConnection, { DocumentInterface } from "@src/database/connection.js";

export class UpdateBankService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(id: string, doc: DocumentInterface, session: unknown) {
    const bankEntity = new BankEntity({
      name: doc.name,
      branch: doc.branch,
      address: doc.address,
      phone: doc.phone,
      fax: doc.fax,
      code: doc.code,
      notes: doc.notes,
      accounts: doc.accounts,
    });

    const bankRepository = new BankRepository(this.db);
    return await bankRepository.update(id, bankEntity.bank, { session });
  }
}
