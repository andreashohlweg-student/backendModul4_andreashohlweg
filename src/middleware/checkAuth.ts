import type { NextFunction, Request, Response } from "express";
import { getUsernameBySession } from "../services/session.service.js";
import { PleaseSignInError } from "../errors/pleaseSignInError.js";

export const checkAuth = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const sessionId = req.cookies.sessionId;

    if (typeof sessionId !== "string") {
      return next(new PleaseSignInError());
    }

    const username = getUsernameBySession(sessionId);

    if (!username) {
      return next(new PleaseSignInError());
    }
    req.user = username;

    next();
  } catch (error) {
    next(error);
  }
};
