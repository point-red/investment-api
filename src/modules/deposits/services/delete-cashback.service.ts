import DatabaseConnection, {
  DocumentInterface,
} from "@src/database/connection.js";
import { DepositRepository } from "@src/modules/deposits/repositories/deposit.repository.js";
import { DepositInterface } from "../entities/deposit.entitiy.js";

export class DeleteCashbackService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(
    id: string,
    doc: DocumentInterface,
    session: unknown
  ) {
    const depositRepository = new DepositRepository(this.db);
    const deposit = (await depositRepository.read(
      id
    )) as unknown as DepositInterface;

    const cashbackPayment = deposit.cashbackPayment;
    cashbackPayment.deletedAt = new Date().toISOString();
    cashbackPayment.deletedBy = doc.deletedBy;
    cashbackPayment.deleteReason = doc.deleteReason;

    return await depositRepository.update(
      id,
      {
        $unset: { cashbackPayment: 1 },
        $push: { cashbackPaymentArchives: cashbackPayment },
      },
      {
        session,
        xraw: true,
      }
    );
  }
}
