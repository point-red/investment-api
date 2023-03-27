import { BankEntity, BankInterface } from "../entities/bank.entity.js";
import { BankRepository } from "../repositories/bank.repository.js";
import DatabaseConnection from "@src/database/connection.js";

export class ReadBankService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(id: string) {
    const bankRepository = new BankRepository(this.db);
    const result = (await bankRepository.read(id)) as unknown as BankInterface;

    const bank: BankInterface = {
      _id: result._id as string,
      name: result.name as string,
      createdBy_id: result.createdBy_id as string,
      createdAt: result.createdAt as Date,
    };
    const bankEntity = new BankEntity(bank);

    return bankEntity.bank;
  }
}
