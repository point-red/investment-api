import { OwnerEntity } from "../entities/owner.entity.js";
import { OwnerRepository } from "../repositories/owner.repository.js";
import DatabaseConnection, { DocumentInterface } from "@src/database/connection.js";

export class CreateOwnerService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(doc: DocumentInterface, session: unknown) {
    const ownerEntity = new OwnerEntity({
      name: doc.name,
      createdBy_id: doc.createdBy_id
    });

    const ownerRepository = new OwnerRepository(this.db);
    return await ownerRepository.create(ownerEntity.owner, { session });
  }
}
