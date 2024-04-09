import DatabaseConnection, {
  DocumentInterface,
} from "@src/database/connection.js";
import { DeleteDepositInterface } from "@src/modules/deposits/entities/deposit.entitiy.js";
import { DepositRepository } from "@src/modules/deposits/repositories/deposit.repository.js";

export class DeleteDepositService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(id: string, doc: DocumentInterface, session: unknown) {
    const deleteDeposit: DeleteDepositInterface = {
      deletedBy: doc.deletedBy,
      deletedReason: doc.deletedReason,
      deletedAt: new Date().toISOString(),
      formStatus: "deleted",
    };

    const depositRepository = new DepositRepository(this.db);
    return await depositRepository.update(id, deleteDeposit, {
      session,
    });
  }
}
