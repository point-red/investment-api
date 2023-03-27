import { db } from "@src/database/database.js";
import { UserRepository } from "@src/modules/auth/repositories/user.repository.js";
import { UserInterface } from "@src/modules/users/entities/user.entity.js";

const userRepository = new UserRepository(db);
const result = await userRepository.readMany({
  fields: "",
  filter: {},
  page: 1,
  pageSize: 1,
  sort: {},
});

const users = result.data as unknown as Array<UserInterface>;

export const ownersSeed = [
  {
    name: "John Doe",
    createdBy_id: users[0]._id,
    createdAt: new Date()
  },
];
