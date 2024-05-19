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
      deleteReason: doc.deleteReason,
      deletedAt: new Date().toISOString(),
      formStatus: "deleted",
    };

    const depositRepository = new DepositRepository(this.db);
    const readDepositService = new ReadDepositService(this.db);
    const deposit = (await readDepositService.handle(id)) as DepositInterface;
    if (deposit.deposit_id) {
      // return parent remaining
      const parentDeposit = (await readDepositService.handle(deposit.deposit_id as string)) as DepositInterface;
      let remaining = (Number(parentDeposit.remaining) || 0) +  Number(deposit.amount)
      if (parentDeposit.isRollOver) {
        remaining = deposit.amount - (Number(parentDeposit.netInterest) || 0)
      }
      await depositRepository.update(
        deposit.deposit_id as string,
        {
          $unset: { renewal_id: 1 },
          $set: { remaining: remaining, renewalAmount: 0 },
        },
        {
          session,
          xraw: true,
        }
      );
    }
    return await depositRepository.update(id, deleteDeposit, {
      session,
    });
  }
}
