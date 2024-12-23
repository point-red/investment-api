import express, { Express } from "express";
import authRouter from "./modules/auth/router.js";
import bankRouter from "./modules/banks/router.js";
import depositRouter from "./modules/deposits/router.js";
import ownersRouter from "./modules/owners/router.js";
import rolesRouter from "./modules/roles/router.js";
import usersRouter from "./modules/users/router.js";

export default function () {
  const app: Express = express();
  /**
   * Register all available modules
   * <modules>/router.ts
   */
  app.use(`/auth`, authRouter);
  app.use(`/roles`, rolesRouter);
  app.use(`/users`, usersRouter);
  app.use(`/owners`, ownersRouter);
  app.use(`/banks`, bankRouter);
  app.use(`/deposits`, depositRouter);

  return app;
}
