import { ObjectId } from "mongodb";
import { BankAccount } from "@src/modules/banks/entities/bank.entity.js";
import { UserInterface } from "@src/modules/users/entities/user.entity.js";

export interface DepositInterface extends CreateDepositInterface {
  _id?: string | ObjectId;
  createdAt?: string;
  createdBy?: UserInterface;
  updatedAt?: string;
  updatedBy?: UserInterface;
  archivedAt?: string | null;
  archivedBy?: UserInterface;
  deletedBy?: UserInterface;
  deletedAt?: string | null;
  deletedReason?: string | null;
  renewalDeposit_id?: string | ObjectId;
}

export interface DeleteDepositInterface {
  deletedBy?: UserInterface;
  deletedAt?: string | null;
  deletedReason?: string | null;
  formStatus?: string;
}

export interface CreateDepositInterface {
  date: string;
  bilyetNumber?: string;
  number?: string;
  bank?: DepositBankInterface;
  owner?: DepositOwnerInterface;
  baseDate: number;
  tenor: number;
  dueDate?: string;
  isRollOver?: boolean;
  amount: number;
  sourceBank?: DepositBankInterface;
  recipientBank?: DepositBankInterface;
  paymentMethod?: "advance" | "in_arrear";
  interestRate: number;
  baseInterest: number;
  taxRate: number;
  grossInterest?: number;
  taxAmount?: number;
  netInterest?: number;
  remaining?: number;
  isCashback?: boolean;
  note?: string;
  interests: DepositInterestInterface[];
  cashbacks?: DepositCashbackInterface[];
}

export interface DepositBankInterface {
  _id: string | ObjectId;
  name: string;
  account: {
    number: string;
    name: string;
  };
}

export interface DepositOwnerInterface {
  _id: string | ObjectId;
  name: string;
}

export interface DepositInterestInterface {
  baseDays: number;
  dueDate?: string;
  gross?: number;
  taxAmount?: number;
  net?: number;
}

export interface DepositCashbackInterface {
  rate: number;
  amount?: number;
  remaining?: number;
}

export interface DepositCashbackPaymentInterface {
  _id?: string | ObjectId;
  rate?: number;
  date?: string;
  amount?: number;
  note?: string;
  createdAt?: string;
  createdBy_id?: string | ObjectId;
  updatedAt?: string;
  updatedBy_id?: string | ObjectId;
  deletedBy_id?: string | ObjectId | null;
  deletedAt?: string | null;
  deletedReason?: string | null;
}

export interface DepositInterestPaymentInterface {
  _id?: string | ObjectId;
  baseDays?: number;
  date?: string;
  amount?: number;
  recipientBank_id?: string | ObjectId;
  recipientAccount: BankAccount;
  note?: string;
  createdAt?: string;
  createdBy_id?: string | ObjectId;
  updatedAt?: string;
  updatedBy_id?: string | ObjectId;
  deletedBy_id?: string | ObjectId | null;
  deletedAt?: string | null;
  deletedReason?: string | null;
}

export interface DepositWithdrawalPaymentInterface {
  _id?: string | ObjectId;
  date?: string;
  amount?: number;
  recipientBank_id?: string | ObjectId;
  recipientAccount: BankAccount;
  note?: string;
  createdAt?: string;
  createdBy_id?: string | ObjectId;
  updatedAt?: string;
  updatedBy_id?: string | ObjectId;
  deletedBy_id?: string | ObjectId | null;
  deletedAt?: string | null;
  deletedReason?: string | null;
}

export const restricted = [];

export class DepositEntity {
  public deposit: DepositInterface | CreateDepositInterface;

  constructor(deposit: DepositInterface | CreateDepositInterface) {
    this.deposit = deposit;
  }
}
