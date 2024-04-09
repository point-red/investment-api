import DatabaseConnection from "@src/database/connection.js";
import { DepositRepository } from "@src/modules/deposits/repositories/deposit.repository.js";
import {
  DepositEntity,
  DepositInterface,
} from "@src/modules/deposits/entities/deposit.entitiy.js";

export class ReadDepositService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(id: string) {
    const depositRepository = new DepositRepository(this.db);
    const result = (await depositRepository.read(
      id
    )) as unknown as DepositInterface;
    const depositEntity = new DepositEntity(result);

    return depositEntity.deposit;
  }
}
