import DatabaseConnection, {
  DocumentInterface,
} from "@src/database/connection.js";
import {
  DeleteDepositInterface,
  DepositInterface,
} from "@src/modules/deposits/entities/deposit.entitiy.js";
import { DepositRepository } from "@src/modules/deposits/repositories/deposit.repository.js";
import { ReadDepositService } from "@src/modules/deposits/services/read.service.js";

export class DeleteDepositService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(id: string, doc: DocumentInterface, session: unknown) {
    const deleteDeposit: DeleteDepositInterface = {
      deletedBy: doc.deletedBy,
      // deletedReason: doc.deletedReason,
      deletedAt: new Date().toISOString(),
      formStatus: "deleted",
    };

    const depositRepository = new DepositRepository(this.db);
    const readDepositService = new ReadDepositService(this.db);
    const deposit = (await readDepositService.handle(id)) as DepositInterface;
    if (deposit.renewal_id) {
      await depositRepository.update(
        deposit.renewal_id as string,
        deleteDeposit,
        {
          session,
        }
      );
    }
    return await depositRepository.update(id, deleteDeposit, {
      session,
    });
  }
}
