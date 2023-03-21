import { ObjectId } from 'mongodb';
import { BankEntity } from "../entities/bank.entity.js";
import { BankRepository } from "../repositories/bank.repository.js";
import DatabaseConnection, { DocumentInterface } from "@src/database/connection.js";

export class RequestDeleteBankService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(id: string, doc: DocumentInterface, session: unknown) {
    const bankEntity = new BankEntity({
      requestApprovalDeleteTo_id: new ObjectId(doc.approvalTo),
      requestApprovalDeleteReason: doc.reasonDelete,
      requestApprovalDeleteAt: new Date(),
      requestApprovalDeleteStatus: "pending"
    });

    const bankRepository = new BankRepository(this.db);
    return await bankRepository.update(id, bankEntity.bank, { session });
  }
}
