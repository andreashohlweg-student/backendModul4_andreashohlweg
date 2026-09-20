import type { Request, Response, NextFunction } from "express";
import type {
  LoginRequestBody,
  LoginResponse,
  LogoutResponse,
  MeResponse,
} from "../types/auth.js";

import { getAllUsers } from "../services/user.service.js";
import {
  createSession,
  deleteSession,
  getUsernameBySession,
} from "../services/session.service.js";
import { InvalidCredentialsError } from "../errors/invalidCredentialsError.js";
import { NotSignedInError } from "../errors/notSignedInError.js";

const registeredUsers = new Map<string, string>(
  getAllUsers().map((user) => [
    user.username,
    process.env[`${user.username.toUpperCase()}_PASSWORD`] ?? "",
  ]),
);

export const login = (
  req: Request<{}, {}, LoginRequestBody>,
  res: Response<LoginResponse>,
  next: NextFunction,
) => {
  try {
    const { username, password } = req.body;
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
