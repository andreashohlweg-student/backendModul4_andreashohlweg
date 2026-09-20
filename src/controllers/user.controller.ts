import type { Request, Response, NextFunction } from "express";

import {
  getAllUsers,
  getUserByUsername,
} from "../services/user.service.js";

export const getUsers = (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = getAllUsers();

    return res.status(200).json(users);
  } catch(error) {
    next(error);
  } 
  
};

export const getUser = (
  req: Request<{ username: string }>,
  res: Response,
  next: NextFunction
) => {
    try {
        const { username } = req.params;

        const user = getUserByUsername(username);

        return res.status(200).json(user);
        
    } catch(error) {
        next(error);
    }
  
};