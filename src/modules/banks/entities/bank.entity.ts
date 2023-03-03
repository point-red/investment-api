import { ObjectId } from "mongodb";

export interface BankInterface extends CreateBankInterface {
  _id?: string | ObjectId;
  createdAt?: Date;
  createdBy_id?: string;
  updatedAt?: Date;
  updatedBy_id?: string;
  archivedAt?: string | Date;
  archivedBy_id?: string;
  requestApprovalDeleteTo_id?: string;
  requestApprovalDeleteAt?: Date;
  requestApprovalDeleteReason?: string;
  requestApprovalDeleteReasonReject?: string;
  requestApprovalDeleteStatus?: "pending" | "approved" | "rejected";
}

export interface BankAccount {
  number?: string;
  name?: string;
  notes?: string;
}

export interface CreateBankInterface {
  code?: string;
  name?: string;
  branch?: string;
  address?: string;
  phone?: string;
  fax?: string;
  notes?: string;
  accounts?: Array<BankAccount>;
}

export const restricted = [];

export class BankEntity {
  public bank: BankInterface | CreateBankInterface;

  constructor(bank: BankInterface | CreateBankInterface) {
    this.bank = bank;
  }
}
