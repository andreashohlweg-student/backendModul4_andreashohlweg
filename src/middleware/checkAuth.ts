import type { NextFunction, Request, Response } from "express";
import { getUsernameBySession } from "../services/session.service.js";
import { AppError } from "../errors/appError.js";
import { PleaseSignInError } from "../errors/pleaseSignInError.js";

export const checkAuth = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const sessionId = req.cookies.sessionId;

  const username = getUsernameBySession(sessionId);

  if (!username) {
    return next(new PleaseSignInError());
  }
  req.user = username;

  next();
};