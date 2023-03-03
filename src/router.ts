import express, { Express } from "express";
import authRouter from "./modules/auth/router.js";
import usersRouter from "./modules/users/router.js";
import ownersRouter from "./modules/owners/router.js";
import bankRouter from "./modules/banks/router.js";

export default function () {
  const app: Express = express();
  /**
   * Register all available modules
   * <modules>/router.ts
   */
  app.use(`/auth`, authRouter);
  app.use(`/users`, usersRouter);
  app.use(`/owners`, ownersRouter);
  app.use(`/banks`, bankRouter);

  return app;
}
