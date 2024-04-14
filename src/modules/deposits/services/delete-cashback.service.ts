import DatabaseConnection, {
  DocumentInterface,
} from "@src/database/connection.js";
import { DeleteDepositInterface } from "@src/modules/deposits/entities/deposit.entitiy.js";
import { DepositRepository } from "@src/modules/deposits/repositories/deposit.repository.js";
import { ObjectId } from "mongodb";

export class DeleteCashbackService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(
    id: string,
    cashbackId: string,
    doc: DocumentInterface,
    session: unknown
  ) {
    const depositRepository = new DepositRepository(this.db);
    return await depositRepository.update(
      id,
      {
        $pull: { cashbackPayments: { _id: new ObjectId(cashbackId) } },
      },
      {
        session,
        xraw: true,
      }
    );
  }
}
