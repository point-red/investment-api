import { OwnerRepository } from "../repositories/owner.repository.js";
import DatabaseConnection, { DeleteOptionsInterface } from "@src/database/connection.js";

export class DestroyOwnerService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(id: string, options: DeleteOptionsInterface) {
    const ownerRepository = new OwnerRepository(this.db);
    const response = await ownerRepository.delete(id, options);
    return;
  }
}
