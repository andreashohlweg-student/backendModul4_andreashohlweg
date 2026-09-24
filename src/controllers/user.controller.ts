import type { Request, Response, NextFunction } from "express";

import {
  getAllUsers,
  getUserByUsername,
} from "../services/user.service.js";

export const getUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await getAllUsers();

    return res.status(200).json(users);
  } catch(error) {
    next(error);
  } 
  
};

export const getUser = async (
  req: Request<{ username: string }>,
  res: Response,
  next: NextFunction
) => {
    try {
        const { username } = req.params;

        const user = await getUserByUsername(username);

        return res.status(200).json(user);
        
    } catch(error) {
        next(error);
    }
  
};
