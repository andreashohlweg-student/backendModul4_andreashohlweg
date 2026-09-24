import type { NextFunction, Request, Response } from "express";
import { getUsernameBySession } from "../services/session.service.js";
import { PleaseSignInError } from "../errors/pleaseSignInError.js";

export const checkAuth = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const sessionId = req.cookies.sessionId;

  if (typeof sessionId !== "string") {
    throw new PleaseSignInError();
  }

  const username = getUsernameBySession(sessionId);

  if (!username) {
    throw new PleaseSignInError();
  }

  req.user = username;
  next();
};
