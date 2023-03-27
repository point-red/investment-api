import permission from '@src/middleware/permission.js';
import { Router } from "express";
import auth from "@src/middleware/auth.js";
import password from "@src/middleware/password.js";
import * as controller from "./controllers/index.js";

const router = Router();

router.get("/", auth, permission("role.view"), controller.readMany);
router.get("/:id", auth, permission("role.view"), controller.read);
router.post("/", auth, permission("role.create"), controller.create);
router.patch("/:id", auth, permission("role.update"), controller.update);
router.delete("/:id", auth, permission("role.delete"), password, controller.destroy);

export default router;
