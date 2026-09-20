import usersData from "../../data/users.json" with { type: "json" };

import type { User } from "../types/user.js";

const users: User[] = usersData;

export const getAllUsers = (): User[] => {
  return users;
};

export const getUserByUsername = (
  username: string,
): User | undefined => {
  return users.find((user) => user.username === username);
};