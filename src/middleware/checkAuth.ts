import type { NextFunction, Request, Response } from "express";
import { getUsernameBySession } from "../services/session.service.js";

export const checkAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const sessionId = req.cookies.sessionId;

  const username = getUsernameBySession(sessionId);

  if (!username) {
    return res.status(401).json({
      error: "Please sign in",
    });
  }

  req.user = username;

  next();
};