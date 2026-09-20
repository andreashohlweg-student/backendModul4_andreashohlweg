import type { Request, Response } from "express";

import {
  getAllUsers,
  getUserByUsername,
} from "../services/user.service.js";

export const getUsers = (
  _req: Request,
  res: Response,
) => {
  const users = getAllUsers();

  return res.status(200).json(users);
};

export const getUser = (
  req: Request<{ username: string }>,
  res: Response,
) => {
  const { username } = req.params;

  const user = getUserByUsername(username);

  if (!user) {
    return res.status(404).json({
      error: "User not found",
    });
  }

  return res.status(200).json(user);
};