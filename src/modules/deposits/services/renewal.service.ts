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
      _id: new ObjectId(),
      deposit_id: new ObjectId(id),
      date: doc.date,
      bilyetNumber: depositEntity.deposit.bilyetNumber,
      number: doc.number,
      bank: depositEntity.deposit.bank,
      account: depositEntity.deposit.account,
      owner: depositEntity.deposit.owner,
      baseDate: doc.baseDate,
      tenor: doc.tenor,
      dueDate: doc.dueDate,
      isRollOver: doc.isRollOver,
      amount: Number(doc.amount),
      remaining: Number(doc.amount),
      sourceBank: depositEntity.deposit.sourceBank,
      sourceBankAccount: depositEntity.deposit.sourceBankAccount,
      recipientBank: depositEntity.deposit.recipientBank,
      recipientBankAccount: depositEntity.deposit.recipientBankAccount,
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
      formStatus: doc.formStatus,
      createdBy: doc.createdBy,
    });

    const created = await depositRepository.create(newDepositEntity.deposit, {
      session,
    });

    let remaining = Number(deposit.remaining || 0) 
    let renewalAmount = newDepositEntity.deposit.amount
    if (deposit.isRollOver) {
      renewalAmount = newDepositEntity.deposit.amount - Number(deposit.netInterest || 0)
    }
    remaining -= renewalAmount

    await depositRepository.update(
      id,
      {
        $set: { renewal_id: new ObjectId(created._id), remaining: remaining, renewalAmount: newDepositEntity.deposit.amount },
      },
      {
        session,
        xraw: true,
      }
    );

    return created;
  }
}
