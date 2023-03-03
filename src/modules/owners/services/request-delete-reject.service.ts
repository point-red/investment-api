import { OwnerEntity } from "../entities/owner.entity.js";
import { OwnerRepository } from "../repositories/owner.repository.js";
import DatabaseConnection, { DocumentInterface } from "@src/database/connection.js";

export class RequestDeleteRejectOwnerService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(id: string, doc: DocumentInterface, session: unknown) {
    const ownerEntity = new OwnerEntity({
      requestApprovalDeleteReasonReject: doc.reasonReject,
      requestApprovalDeleteStatus: "rejected"
    });

    const ownerRepository = new OwnerRepository(this.db);
    return await ownerRepository.update(id, ownerEntity.owner, { session });
  }
}
