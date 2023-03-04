import { Router } from "express";
import * as controller from "./controllers/index.js";

const router = Router();

router.get("/", controller.readMany);
router.get("/:id", controller.read);
router.post("/", controller.create);
router.patch("/:id", controller.update);
router.delete("/:id", controller.destroy);
router.post("/:id/archive", controller.archive);
router.post("/:id/restore", controller.restore);
router.post("/:id/request-delete", controller.requestDelete);
router.post("/:id/request-delete/approve", controller.requestDeleteApprove);
router.post("/:id/request-delete/reject", controller.requestDeleteReject);

export default router;