import { ObjectId } from "mongodb";

export interface OwnerInterface extends CreateOwnerInterface {
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
