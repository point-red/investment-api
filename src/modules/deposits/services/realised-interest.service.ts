import DatabaseConnection, {
  DocumentInterface,
} from "@src/database/connection.js";
import {
  DepositCashbackPaymentInterface,
  DepositInterface,
} from "@src/modules/deposits/entities/deposit.entitiy.js";
import { DepositRepository } from "@src/modules/deposits/repositories/deposit.repository.js";
import { ObjectId } from "mongodb";

export class RealisedInterestService {
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
          $pull: { interestPayments: { _id: new ObjectId(doc._id) } },
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

    const interests = [];
    let totalRemaining = 0;
    for (const cashback of doc.interests) {
      totalRemaining += Number(cashback.amount);
    }
    for (const interest of doc.interests) {
      const payments = [];
      interest.remaining = Number(interest.net);
      for (const payment of interest.payments) {
        payments.push({
          bank: payment.bank,
          account: payment.account,
          date: payment.date,
          amount: Number(payment.amount),
          remaining: Number(interest.remaining),
        });
        interest.remaining -= Number(payment.amount);
        totalRemaining -= Number(payment.amount);
      }
      interest.payments = payments;
      interests.push(interest);
    }
    doc.interests = interests;

    if (totalRemaining == 0) {
      doc.status = "complete";
    } else {
      doc.status = "incomplete";
    }

    await depositRepository.update(
      id,
      {
        $set: { formStatus: "pending" },
        $push: {
          interestPayments: doc,
        },
      },
      {
        session,
        xraw: true,
      }
    );
  }
}
