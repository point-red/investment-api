import { ObjectId } from "mongodb";

export interface BankInterface extends CreateBankInterface {
  _id?: string | ObjectId;
  createdAt?: Date;
  createdBy_id?: string | ObjectId;
  updatedAt?: Date;
  updatedBy_id?: string | ObjectId;
  archivedAt?: string | Date;
  archivedBy_id?: string | ObjectId;
  requestApprovalDeleteTo_id?: string | ObjectId;
  requestApprovalDeleteAt?: Date;
  requestApprovalDeleteReason?: string;
  requestApprovalDeleteReasonReject?: string;
  requestApprovalDeleteStatus?: "pending" | "approved" | "rejected";
}

export interface BankAccount {
  number?: number;
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
