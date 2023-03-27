import permission from '@src/middleware/permission.js';
import { Router } from "express";
import auth from "@src/middleware/auth.js";
import password from "@src/middleware/password.js";
import * as controller from "./controllers/index.js";

const router = Router();

router.get("/", auth, permission("user.view"), controller.readMany);
router.get("/:id", auth, permission("user.view"), controller.read);
router.post("/", auth, permission("user.create"), controller.invite);
router.patch("/:id", auth, permission("user.update"), controller.update);
router.delete("/:id", auth, permission("user.delete"), password, controller.destroy);

export default router;
