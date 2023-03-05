import { Router } from "express";
import auth from "@src/middleware/auth.js";
import password from "@src/middleware/password.js";
import * as controller from "./controllers/index.js";

const router = Router();

router.get("/", auth, controller.readMany);
router.get("/:id", auth, controller.read);
router.post("/", auth, controller.invite);
router.patch("/:id", auth, controller.update);
router.delete("/:id", auth, password, controller.destroy);

export default router;
