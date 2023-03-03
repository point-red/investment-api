import { BankEntity } from "../entities/bank.entity.js";
import { BankRepository } from "../repositories/bank.repository.js";
import DatabaseConnection, { DocumentInterface } from "@src/database/connection.js";

export class RequestDeleteRejectBankService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(id: string, doc: DocumentInterface, session: unknown) {
    const bankEntity = new BankEntity({
      requestApprovalDeleteReasonReject: doc.reasonReject,
      requestApprovalDeleteStatus: "rejected"
    });

    const bankRepository = new BankRepository(this.db);
    return await bankRepository.update(id, bankEntity.bank, { session });
  }
}
