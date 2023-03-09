import { BaseCommand } from "@point-hub/express-cli";
import { connection } from "@src/config/database.js";
import MongoDbConnection from "@src/database/connection-mongodb.js";
import DatabaseConnection from "@src/database/connection.js";

export default class DbSeedCommand extends BaseCommand {
  constructor() {
    super({
      name: "db:seed",
      description: "Seed database",
      summary: "Seed database",
      arguments: [],
      options: [],
    });
  }
  async handle(): Promise<void> {
    try {
      const dbConnection = new DatabaseConnection(
        new MongoDbConnection({
          name: connection[connection.default].name,
          protocol: connection[connection.default].protocol,
          host: connection[connection.default].host,
          url: connection[connection.default].url,
        })
      );
      dbConnection.database(connection[connection.default].name);

      // Roles
      const { rolesSeed } = await import("@src/modules/roles/seeds/roles.seed.js");
      await dbConnection.collection("roles").deleteAll();
      const rolesData = await dbConnection.collection("roles").createMany(rolesSeed);
      console.info(rolesData);

      // Users
      const { usersSeed } = await import("@src/modules/users/seeds/users.seed.js");
      await dbConnection.collection("users").deleteAll();
      const usersData = await dbConnection.collection("users").createMany(usersSeed);
      console.info(usersData);

      // Owners
      const { ownersSeed } = await import("@src/modules/owners/seeds/owners.seed.js");
      await dbConnection.collection("owners").deleteAll();
      const ownersData = await dbConnection.collection("owners").createMany(ownersSeed);
      console.info(ownersData);

      // Banks
      const { banksSeed } = await import("@src/modules/banks/seeds/banks.seed.js");
      await dbConnection.collection("banks").deleteAll();
      const banksData = await dbConnection.collection("banks").createMany(banksSeed);
      console.info(banksData);
    } catch (error) {
      console.error(error);
    } finally {
      process.exit();
    }
  }
}
