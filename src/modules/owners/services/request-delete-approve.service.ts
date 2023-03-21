import { OwnerEntity } from "../entities/owner.entity.js";
import { OwnerRepository } from "../repositories/owner.repository.js";
import DatabaseConnection from "@src/database/connection.js";

export class RequestDeleteApproveOwnerService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(id: string, session: unknown) {
    const ownerEntity = new OwnerEntity({
      requestApprovalDeleteReasonReject: null,
      requestApprovalDeleteStatus: "approved"
    });

    const ownerRepository = new OwnerRepository(this.db);
    return await ownerRepository.update(id, ownerEntity.owner, { session });
  }
}
