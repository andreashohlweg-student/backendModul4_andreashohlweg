import type { NextFunction, Request, Response } from "express";
import { RouteNotFoundError } from "../errors/routeNotFoundError.js";

export const notFoundHandler = (
  _req: Request,
  _res: Response,
  next: NextFunction,
) => {
  next(new RouteNotFoundError());
};
