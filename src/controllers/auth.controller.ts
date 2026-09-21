import type { Request, Response, NextFunction } from "express";
import type { LoginResponse, LogoutResponse, MeResponse } from "../types/auth.js";

import { getAllUsers } from "../services/user.service.js";
import {
  createSession,
  deleteSession,
  getUsernameBySession,
} from "../services/session.service.js";
import { InvalidCredentialsError } from "../errors/invalidCredentialsError.js";
import { LoginCredentialsRequiredError } from "../errors/loginCredentialsRequiredError.js";
import { NotSignedInError } from "../errors/notSignedInError.js";
import { isRecord } from "../utils/isRecord.js";

const registeredUsers = new Map<string, string>(
  getAllUsers().map((user) => [
    user.username,
    process.env[`${user.username.toUpperCase()}_PASSWORD`] ?? "",
  ]),
);

export const login = (
  req: Request<{}, {}, unknown>,
  res: Response<LoginResponse>,
  next: NextFunction,
) => {
  try {
    if (!isRecord(req.body)) {
      return next(new LoginCredentialsRequiredError());
    }

    const { username, password } = req.body;

    if (
      typeof username !== "string"
      || username.trim().length === 0
      || typeof password !== "string"
      || password.length === 0
    ) {
      return next(new LoginCredentialsRequiredError());
    }

    const storedPassword = registeredUsers.get(username);

    if (!storedPassword || storedPassword !== password) {
      return next(new InvalidCredentialsError());
    }

    const sessionId = createSession(username);

    res.cookie("sessionId", sessionId, {
      httpOnly: true,
    });

    res.json({
      message: "Login succeeded",
    });
  } catch (error) {
    next(error);
  }
};

export const logout = (
  req: Request,
  res: Response<LogoutResponse>,
  next: NextFunction,
) => {
  try {
    const sessionId = req.cookies.sessionId;

    if (typeof sessionId === "string") {
      deleteSession(sessionId);
    }

    res.clearCookie("sessionId");

    res.json({
      success: true,
      message: "Logged out",
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = (
  req: Request,
  res: Response<MeResponse>,
  next: NextFunction,
) => {
  try {
    const sessionId = req.cookies.sessionId;

    if (typeof sessionId !== "string") {
      return next(new NotSignedInError());
    }

    const username = getUsernameBySession(sessionId);

    if (!username) {
      return next(new NotSignedInError());
    }

    res.json({
      user: username,
    });
  } catch (error) {
    next(error);
  }
};
