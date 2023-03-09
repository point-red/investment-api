import { OwnerEntity, OwnerInterface } from "../entities/owner.entity.js";
import { OwnerRepository } from "../repositories/owner.repository.js";
import DatabaseConnection from "@src/database/connection.js";

export class ReadOwnerService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(id: string) {
    const ownerRepository = new OwnerRepository(this.db);
    const result = (await ownerRepository.read(id)) as unknown as OwnerInterface;

    const owner: OwnerInterface = {
      _id: result._id as string,
      name: result.name as string,
      createdBy_id: result.createdBy_id as string,
      createdAt: result.createdAt as Date,
    };
    const ownerEntity = new OwnerEntity(owner);

    return ownerEntity.owner;
  }
}
