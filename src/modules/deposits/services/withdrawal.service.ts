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
    let totalRemaining = Number(deposit.amount);
    if (deposit.isRollOver) {
      totalRemaining += Number(deposit.netInterest);
    }
    for (const payment of doc.payments) {
      payments.push({
        bank: payment.bank,
        account: payment.account,
        date: payment.date,
        amount: Number(payment.amount),
        remaining: remaining,
      });
      remaining -= Number(payment.amount);
    }

    if (totalRemaining == 0) {
      doc.status = "complete";
    } else {
      doc.status = "incomplete";
    }

    doc.payments = payments;
    await depositRepository.update(
      id,
      {
        $set: { withdrawal: doc, remaining: remaining },
      },
      {
        session,
        xraw: true,
      }
    );
  }
}
