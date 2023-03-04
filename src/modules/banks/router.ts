import { Router } from "express";
import auth from "@src/middleware/auth.js";
import * as controller from "./controllers/index.js";

const router = Router();

router.get("/", auth, controller.readMany);
router.get("/:id", auth, controller.read);
router.post("/", auth, controller.create);
router.patch("/:id", auth, controller.update);
router.delete("/:id", auth, controller.destroy);
router.post("/:id/archive", auth, controller.archive);
router.post("/:id/restore", auth, controller.restore);
router.post("/:id/request-delete", auth, controller.requestDelete);
router.post("/:id/request-delete/approve", auth, controller.requestDeleteApprove);
router.post("/:id/request-delete/reject", auth, controller.requestDeleteReject);

export default router;
