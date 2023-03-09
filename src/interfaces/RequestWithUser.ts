import { Request } from "express";
import { UserInterface } from "@src/modules/users/entities/user.entity";

interface RequestWithUser extends Request {
    user?: UserInterface;
}

export default RequestWithUser;