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

export class RenewalService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(id: string, doc: DocumentInterface, session: unknown) {
    const depositRepository = new DepositRepository(this.db);
    const deposit = (await depositRepository.read(
      id
    )) as unknown as DepositInterface;
    const depositEntity = new DepositEntity(deposit);
    const newDepositEntity = new DepositEntity({
      ...depositEntity.deposit,
      _id: new ObjectId(),
      date: doc.date,
      number: doc.number,
      baseDate: doc.baseDate,
      tenor: doc.tenor,
      dueDate: doc.dueDate,
      isRollOver: doc.isRollOver,
      amount: doc.amount,
      remaining: doc.remaining,
      paymentMethod: doc.paymentMethod,
      interestRate: doc.interestRate,
      baseInterest: doc.baseInterest,
      taxRate: doc.taxRate,
      grossInterest: doc.grossInterest,
      taxAmount: doc.taxAmount,
      returns: doc.returns,
      netInterest: doc.netInterest,
      isCashback: doc.isCashback,
      cashbacks: doc.cashbacks,
      note: doc.note,
      cashbackPayments: [],
      interestPayments: [],
      withdrawals: [],
      formStatus: "draft",
      createdBy: doc.createdBy,
    });

    const created = await depositRepository.create(newDepositEntity.deposit, {
      session,
    });

    await depositRepository.update(
      id,
      {
        $set: { renewal_id: created._id, formStatus: "completed" },
        $push: {
          withdrawals: doc,
        },
      },
      {
        session,
        xraw: true,
      }
    );

    return created;
  }
}
