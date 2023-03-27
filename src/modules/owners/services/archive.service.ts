import { ObjectId } from "mongodb";
import { OwnerEntity } from "../entities/owner.entity.js";
import { OwnerRepository } from "../repositories/owner.repository.js";
import DatabaseConnection, { DocumentInterface } from "@src/database/connection.js";

export class ArchiveOwnerService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(id: string, doc: DocumentInterface, session: unknown) {
    const ownerEntity = new OwnerEntity({
      archivedBy_id: new ObjectId(doc.archivedBy_id),
      archivedAt: new Date(),
    });

    const ownerRepository = new OwnerRepository(this.db);
    return await ownerRepository.update(id, ownerEntity.owner, { session });
  }
}
