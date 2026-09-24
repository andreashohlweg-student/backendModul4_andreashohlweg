import { UserNotFoundError } from "../errors/userNotFoundError.js";
import {
  checkUserExists,
  findAllUsers,
  findUserByUsername,
} from "../repositories/user.repo.js";
import type { User } from "../types/user.js";

export const getAllUsers = async (): Promise<User[]> => {
  return findAllUsers();
};

export const getUserByUsername = async (username: string): Promise<User> => {
  const user = await findUserByUsername(username);

  if (!user) {
    throw new UserNotFoundError();
  }

  return user;
};

export const userExists = async (username: string): Promise<boolean> => {
  return checkUserExists(username);
};
