import { ObjectId } from "mongodb";
import { hash } from "@src/utils/hash.js";

export interface UserInterface {
  _id?: string | ObjectId;
  username?: string;
  email?: string;
  password?: string;
  name?: string;
  lastname?: string;
  mobilephone?: string;
  role?: string;
  role_id?: string | ObjectId;
  emailValidationCode?: string;
  status?: "registered" | "activated" | "suspended";
  googleDriveId?: string;
  oauth?: {
    google?: object;
  };
  oauthVerification?: {
    google?: string;
  };
  permissions?: string[];
}

export const restricted = ["password"];

export const hasOne: any = {
  role: {
    from: "roles",
    localField: "role_id",
    foreignField: "_id",
    as: "role",
  },
};

export const addFields: any = {
  role: { $arrayElemAt: ["$role", 0] },
};

export class UserEntity {
  public user: UserInterface;

  constructor(user: UserInterface) {
    this.user = user;
  }

  public generateEmailValidationCode() {
    this.user.emailValidationCode = new ObjectId().toString();
  }

  public async generateRandomUsername() {
    this.user.username = `username-${Math.random()}`;
  }

  public async generateRandomPassword() {
    this.user.password = await hash(new Date().toString());
  }

  public suspendUser() {
    this.user.status = "suspended";
  }
}
