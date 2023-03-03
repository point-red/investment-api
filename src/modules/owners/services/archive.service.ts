import { OwnerEntity } from "../entities/owner.entity.js";
import { OwnerRepository } from "../repositories/owner.repository.js";
import DatabaseConnection from "@src/database/connection.js";

export class ArchiveOwnerService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(id: string, session: unknown) {
    const ownerEntity = new OwnerEntity({
      archivedAt: new Date()
    });

    const ownerRepository = new OwnerRepository(this.db);
    return await ownerRepository.update(id, ownerEntity.owner, { session });
  }
}
