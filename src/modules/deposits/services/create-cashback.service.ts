import DatabaseConnection, {
  DocumentInterface,
} from "@src/database/connection.js";
import {
  DepositCashbackPaymentInterface,
  DepositInterface,
} from "@src/modules/deposits/entities/deposit.entitiy.js";
import { DepositRepository } from "@src/modules/deposits/repositories/deposit.repository.js";
import { ObjectId } from "mongodb";

export class CreateCashbackService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(id: string, doc: DocumentInterface, session: unknown) {
    const depositRepository = new DepositRepository(this.db);

    if (doc._id) {
      await depositRepository.update(
        id,
        {
          $pull: { cashbackPayments: { _id: new ObjectId(doc._id) } },
        },
        {
          session,
          xraw: true,
        }
      );

      doc.updatedAt = new Date().toISOString();
      doc.updatedBy = doc.user;
      doc._id = new ObjectId(doc._id);
    } else {
      doc.createdAt = new Date().toISOString();
      doc.createdBy = doc.user;
      doc._id = new ObjectId();
    }

    delete doc.user;

    let totalRemaining = 0;
    for (const cashback of doc.cashbacks) {
      totalRemaining += Number(cashback.amount);
    }
    for (const cashback of doc.cashbacks) {
      cashback.amount = Number(cashback.amount);
      cashback.received = Number(cashback.received);
      totalRemaining -= Number(cashback.received);
    }

    if (totalRemaining == 0) {
      doc.status = "complete";
    } else {
      doc.status = "incomplete";
    }

    await depositRepository.update(
      id,
      {
        $push: {
          cashbackPayments: doc,
        },
      },
      {
        session,
        xraw: true,
      }
    );
  }
}
