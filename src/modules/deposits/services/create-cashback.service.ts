import DatabaseConnection, {
  DocumentInterface,
} from "@src/database/connection.js";
import { DepositInterface } from "@src/modules/deposits/entities/deposit.entitiy.js";
import { DepositRepository } from "@src/modules/deposits/repositories/deposit.repository.js";
import { ObjectId } from "mongodb";

export class CreateCashbackService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(id: string, doc: DocumentInterface, session: unknown) {
    const depositRepository = new DepositRepository(this.db);
    const deposit = (await depositRepository.read(
      id
    )) as unknown as DepositInterface;

    if (deposit.cashbacks) {
      console.log("masuk");
      for (const payment of doc.payments) {
        console.log(payment);
        const cashback = deposit.cashbacks.find(
          (obj) => obj.rate === payment.rate
        );
        console.log(payment);

        if (cashback) {
          await depositRepository.update(
            id,
            {
              $pull: { cashbacks: cashback },
            },
            {
              session,
              xraw: true,
            }
          );

          if (cashback.remaining) {
            cashback.remaining -= payment.received;
          }

          await depositRepository.update(
            id,
            {
              $push: {
                cashbacks: cashback,
                cashbackPayments: {
                  _id: new ObjectId(),
                  rate: payment.rate,
                  amount: payment.received,
                  date: payment.date,
                },
              },
            },
            {
              session,
              xraw: true,
            }
          );
        }
      }
    }
  }
}
