import { Router } from "express";
import * as controller from "./controllers/index.js";
import auth from "@src/middleware/auth.js";
import password from "@src/middleware/password.js";
import permission from "@src/middleware/permission.js";

const router = Router();

router.get("/report", auth, permission("deposit.view", "withdrawal.view"), controller.readReports);
router.get("/", auth, permission("deposit.view", "withdrawal.view"), controller.readMany);
router.post("/", auth, permission("deposit.create"), controller.create);
router.patch("/:id/cashbacks", auth, permission("deposit.create"), controller.createCashback);
router.delete("/:id/cashbacks/:cashbackId", auth, permission("deposit.delete"), password, controller.destroyCashback);
router.patch("/:id/interests", auth, permission("deposit.update"), controller.updateRealisedInterest);
router.delete("/:id/interests/:interestId", auth, permission("deposit.delete"), password, controller.destroyInterest);
router.patch("/:id/withdrawals", auth, permission("withdrawal.update"), controller.withdrawal);
router.delete(
  "/:id/withdrawals/:withdrawalId",
  auth,
  permission("withdrawal.delete"),
  password,
  controller.destroyWithdrawal
);
router.patch("/:id/renewals", auth, permission("deposit.update"), controller.renewal);
router.get("/:id", auth, permission("deposit.view"), controller.read);
router.patch("/:id", auth, permission("deposit.update"), controller.update);
router.delete("/:id", auth, permission("deposit.delete"), password, controller.destroy);

export default router;
