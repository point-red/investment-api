import DatabaseConnection, {
  DocumentInterface,
} from "@src/database/connection.js";
import {
  DepositCashbackPaymentInterface,
  DepositEntity,
  DepositInterface,
} from "@src/modules/deposits/entities/deposit.entitiy.js";
import { DepositRepository } from "@src/modules/deposits/repositories/deposit.repository.js";
import { ObjectId } from "mongodb";

export class WithdrawalService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(id: string, doc: DocumentInterface, session: unknown) {
    const depositRepository = new DepositRepository(this.db);
    const deposit = (await depositRepository.read(
      id
    )) as unknown as DepositInterface;

    if (doc._id) {
      await depositRepository.update(
        id,
        {
          $pull: { withdrawals: { _id: new ObjectId(doc._id) } },
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

    const payments = [];
    let remaining = Number(deposit.amount);
    for (const payment of doc.payments) {
      payments.push({
        bank: payment.bank,
        account: payment.account,
        recipientName: payment.recipientName,
        date: payment.date,
        amount: Number(payment.amount),
        remaining: remaining,
      });
      remaining -= Number(payment.amount);
    }
    doc.payments = payments;
    await depositRepository.update(
      id,
      {
        $set: { remaining: remaining },
        $push: {
          withdrawals: doc,
        },
      },
      {
        session,
        xraw: true,
      }
    );
  }
}
