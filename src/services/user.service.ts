import { UserNotFoundError } from "../errors/userNotFoundError.js";
import { pool } from "../database.js";
import type { User } from "../types/user.js";

type UserRow = {
  id: number;
  username: string;
  fullname: string;
  profile_description: string;
};

const toUser = (row: UserRow): User => ({
  id: row.id,
  username: row.username,
  fullname: row.fullname,
  profileDescription: row.profile_description,
});

export const getAllUsers = async (): Promise<User[]> => {
  const result = await pool.query<UserRow>(`
    SELECT id, username, fullname, profile_description
    FROM users
    ORDER BY id
  `);

  return result.rows.map(toUser);
};

export const getUserByUsername = async (username: string): Promise<User> => {
  const result = await pool.query<UserRow>(`
    SELECT id, username, fullname, profile_description
    FROM users
    WHERE username = $1
  `, [username]);

  const row = result.rows[0];

  if (!row) {
    throw new UserNotFoundError();
  }

  return toUser(row);
};

export const userExists = async (username: string): Promise<boolean> => {
  const result = await pool.query<{ exists: boolean }>(
    "SELECT EXISTS (SELECT 1 FROM users WHERE username = $1) AS exists",
    [username],
  );

  return result.rows[0]?.exists ?? false;
};
