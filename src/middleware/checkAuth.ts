import type { NextFunction, Request, Response } from "express";
import { getUsernameBySession } from "../services/session.service.js";
import { AppError } from "../errors/appError.js";

export const checkAuth = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const sessionId = req.cookies.sessionId;

  const username = getUsernameBySession(sessionId);

  if (!username) {
    return next(new AppError(401, "Please sign in"));
  }
  req.user = username;

  next();
};