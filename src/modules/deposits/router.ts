import permission from "@src/middleware/permission.js";
import { Router } from "express";
import auth from "@src/middleware/auth.js";
import password from "@src/middleware/password.js";
import * as controller from "./controllers/index.js";

const router = Router();

router.get("/", auth, permission("deposit.view"), controller.readMany);
router.post("/", auth, permission("deposit.create"), controller.create);
router.post(
  "/:id/cashbacks",
  auth,
  permission("deposit.create"),
  controller.createCashback
);
router.get("/:id", auth, permission("deposit.view"), controller.read);
router.patch("/:id", auth, permission("deposit.update"), controller.update);
router.delete(
  "/:id",
  auth,
  permission("deposit.delete"),
  password,
  controller.destroy
);

export default router;
