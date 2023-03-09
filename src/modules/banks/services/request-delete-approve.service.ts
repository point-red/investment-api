import { BankEntity } from "../entities/bank.entity.js";
import { BankRepository } from "../repositories/bank.repository.js";
import DatabaseConnection from "@src/database/connection.js";

export class RequestDeleteApproveBankService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(id: string, session: unknown) {
    const bankEntity = new BankEntity({
      requestApprovalDeleteReasonReject: "",
      requestApprovalDeleteStatus: "approved"
    });

    const bankRepository = new BankRepository(this.db);
    return await bankRepository.update(id, bankEntity.bank, { session });
  }
}
