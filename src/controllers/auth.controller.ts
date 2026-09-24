import type { Request, Response } from "express";
import type { LoginResponse, LogoutResponse, MeResponse } from "../types/auth.js";

import { userExists } from "../services/user.service.js";
import {
  createSession,
  deleteSession,
  getUsernameBySession,
} from "../services/session.service.js";
import { InvalidCredentialsError } from "../errors/invalidCredentialsError.js";
import { LoginCredentialsRequiredError } from "../errors/loginCredentialsRequiredError.js";
import { NotSignedInError } from "../errors/notSignedInError.js";
import { isRecord } from "../utils/isRecord.js";
import { parseUsername } from "../utils/parseUsername.js";

export const login = async (
  req: Request<{}, {}, unknown>,
  res: Response<LoginResponse>,
) => {
  if (!isRecord(req.body)) {
    throw new LoginCredentialsRequiredError();
  }

  const { username, password } = req.body;

  if (
    typeof username !== "string"
    || username.trim().length === 0
    || typeof password !== "string"
    || password.length === 0
  ) {
    throw new LoginCredentialsRequiredError();
  }

  const normalizedUsername = parseUsername(username);
  const storedPassword = process.env[
    `${normalizedUsername.toUpperCase()}_PASSWORD`
  ];

  if (
    !storedPassword
    || storedPassword !== password
    || !(await userExists(normalizedUsername))
  ) {
    throw new InvalidCredentialsError();
  }

  const sessionId = createSession(normalizedUsername);

  res.cookie("sessionId", sessionId, {
    httpOnly: true,
  });

  res.json({
    message: "Login succeeded",
  });
};

export const logout = (
  req: Request,
  res: Response<LogoutResponse>,
) => {
  const sessionId = req.cookies.sessionId;

  if (typeof sessionId === "string") {
    deleteSession(sessionId);
  }

  res.clearCookie("sessionId");

  res.json({
    success: true,
    message: "Logged out",
  });
};

export const getMe = (
  req: Request,
  res: Response<MeResponse>,
) => {
  const sessionId = req.cookies.sessionId;

  if (typeof sessionId !== "string") {
    throw new NotSignedInError();
  }

  const username = getUsernameBySession(sessionId);

  if (!username) {
    throw new NotSignedInError();
  }

  res.json({
    user: username,
  });
};
