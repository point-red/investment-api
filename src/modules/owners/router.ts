import { Router } from "express";
import auth from "@src/middleware/auth.js";
import password from "@src/middleware/password.js";
import * as controller from "./controllers/index.js";
import permission from "@src/middleware/permission.js";

const router = Router();

router.get("/", auth, permission("owner.view"), controller.readMany);
router.get("/:id", auth, permission("owner.view"), controller.read);
router.post("/", auth, permission("owner.create"), controller.create);
router.patch("/:id", auth, permission("owner.update"), controller.update);
router.delete("/:id", auth, permission("owner.delete"), password, controller.destroy);
router.post("/:id/archive", auth, controller.archive);
router.post("/:id/restore", auth, controller.restore);
router.post("/:id/request-delete", auth, controller.requestDelete);
router.post("/:id/request-delete/approve", auth, controller.requestDeleteApprove);
router.post("/:id/request-delete/reject", auth,controller.requestDeleteReject);

export default router;
