import { InvalidUsernameError } from "../errors/invalidUsernameError.js";

export const parseUsername = (value: string): string => {
  const username = value.trim().toLowerCase();

  if (!/^[a-z0-9_]{1,50}$/.test(username)) {
    throw new InvalidUsernameError();
  }

  return username;
};
