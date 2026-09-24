import type { Request, Response } from "express";
import { RouteNotFoundError } from "../errors/routeNotFoundError.js";

export const notFoundHandler = (
  _req: Request,
  _res: Response,
) => {
  throw new RouteNotFoundError();
};
