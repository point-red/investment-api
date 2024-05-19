import DatabaseConnection, {
  DocumentInterface,
} from "@src/database/connection.js";
import { DepositRepository } from "@src/modules/deposits/repositories/deposit.repository.js";
import { ObjectId } from "mongodb";
import { DepositInterface } from "../entities/deposit.entitiy.js";

export class DeleteInterestService {
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

    const interestPayment = deposit.interestPayment;
    interestPayment.deletedAt = new Date().toISOString();
    interestPayment.deletedBy = doc.deletedBy;
    interestPayment.deleteReason = doc.deleteReason;
    return await depositRepository.update(
      id,
      {
        $unset: { interestPayment: 1 },
        $push: { interestPaymentArchives: interestPayment },
      },
      {
        session,
        xraw: true,
      }
    );
  }
}
