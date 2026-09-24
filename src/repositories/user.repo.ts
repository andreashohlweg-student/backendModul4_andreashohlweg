import { pool } from "../database.js";
import type { User } from "../types/user.js";

export const findAllUsers = async (): Promise<User[]> => {
  const result = await pool.query<User>(`
    SELECT
      id,
      username,
      fullname,
      profile_description AS "profileDescription"
    FROM users
    ORDER BY id
  `);

  return result.rows;
};

export const findUserByUsername = async (
  username: string,
): Promise<User | undefined> => {
  const result = await pool.query<User>(
    `
      SELECT
        id,
        username,
        fullname,
        profile_description AS "profileDescription"
      FROM users
      WHERE username = $1
    `,
    [username],
  );

  return result.rows[0];
};

export const checkUserExists = async (
  username: string,
): Promise<boolean> => {
  const result = await pool.query<{ exists: boolean }>(
    "SELECT EXISTS (SELECT 1 FROM users WHERE username = $1) AS exists",
    [username],
  );

  return result.rows[0]?.exists ?? false;
};
