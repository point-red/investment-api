import { ObjectId } from "mongodb";
import { UserEntity } from "../entities/user.entity.js";
import { UserRepository } from "../repositories/user.repository.js";
import DatabaseConnection, { DocumentInterface } from "@src/database/connection.js";

export class UpdateUserService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(id: string, doc: DocumentInterface, session: unknown) {
    const userEntity = new UserEntity({
      username: doc.username,
      // password: doc.password,
      email: doc.email,
      name: doc.name,
      lastname: doc.lastname,
      mobilephone: doc.mobilephone,
      role_id: new ObjectId(doc.role_id),
    });

    const userRepository = new UserRepository(this.db);
    return await userRepository.update(id, userEntity.user, { session });
  }
}
