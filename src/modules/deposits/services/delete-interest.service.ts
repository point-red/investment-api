import DatabaseConnection, {
  DocumentInterface,
} from "@src/database/connection.js";
import { DepositRepository } from "@src/modules/deposits/repositories/deposit.repository.js";
import { ObjectId } from "mongodb";

export class DeleteInterestService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(
    id: string,
    interestId: string,
    doc: DocumentInterface,
    session: unknown
  ) {
    const depositRepository = new DepositRepository(this.db);
    return await depositRepository.update(
      id,
      {
        $pull: { interestPayments: { _id: new ObjectId(interestId) } },
      },
      {
        session,
        xraw: true,
      }
    );
  }
}
