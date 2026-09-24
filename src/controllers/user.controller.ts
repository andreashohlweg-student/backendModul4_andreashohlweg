import type { Request, Response } from "express";

import {
  getAllUsers,
  getUserByUsername,
} from "../services/user.service.js";

export const getUsers = async (
  _req: Request,
  res: Response,
) => {
  const users = await getAllUsers();

  res.status(200).json(users);
};

export const getUser = async (
  req: Request<{ username: string }>,
  res: Response,
) => {
  const { username } = req.params;

  const user = await getUserByUsername(username);

  res.status(200).json(user);
};
