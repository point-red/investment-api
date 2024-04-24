import DatabaseConnection, {
  DocumentInterface,
} from "@src/database/connection.js";
import { DepositRepository } from "@src/modules/deposits/repositories/deposit.repository.js";
import { ObjectId } from "mongodb";
import { DepositInterface } from "@src/modules/deposits/entities/deposit.entitiy";

export class DeleteWithdrawalService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(
    id: string,
    withdrawalId: string,
    doc: DocumentInterface,
    session: unknown
  ) {
    const depositRepository = new DepositRepository(this.db);
    const deposit = (await depositRepository.read(
      id
    )) as unknown as DepositInterface;

    const withdrawal = deposit.withdrawal;
    withdrawal.deletedAt = new Date().toISOString();
    withdrawal.deletedBy = doc.deletedBy;
    withdrawal.deleteReason = doc.deleteReason;
    return await depositRepository.update(
      id,
      {
        $unset: { withdrawal: 1 },
        $push: { withdrawalArchives: withdrawal },
      },
      {
        session,
        xraw: true,
      }
    );
  }
}
