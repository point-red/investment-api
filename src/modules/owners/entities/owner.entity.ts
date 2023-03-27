import { ObjectId } from "mongodb";

export interface OwnerInterface extends CreateOwnerInterface {
  _id?: string | ObjectId;
  createdAt?: Date;
  createdBy_id?: string | ObjectId;
  updatedAt?: Date;
  updatedBy_id?: string | ObjectId;
  archivedAt?: string | Date | null;
  archivedBy_id?: string | ObjectId | null;
  requestApprovalDeleteTo_id?: string | ObjectId | null;
  requestApprovalDeleteAt?: Date | null;
  requestApprovalDeleteReason?: string | null;
  requestApprovalDeleteReasonReject?: string | null;
  requestApprovalDeleteStatus?: "pending" | "approved" | "rejected";
}

export interface CreateOwnerInterface {
  name?: string;
}

export const restricted = [];

export class OwnerEntity {
  public owner: OwnerInterface | CreateOwnerInterface;

  constructor(owner: OwnerInterface | CreateOwnerInterface) {
    this.owner = owner;
  }
}
