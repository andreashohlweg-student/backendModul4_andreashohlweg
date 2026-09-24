import { queryDatabase } from "../database.js";
import { UnexpectedDatabaseResultError } from "../errors/unexpectedDatabaseResultError.js";
import type { User } from "../types/user.js";

export const findAllUsers = async (): Promise<User[]> => {
  const result = await queryDatabase<User>(`
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
  const result = await queryDatabase<User>(
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
  const result = await queryDatabase<{ exists: boolean }>(
    "SELECT EXISTS (SELECT 1 FROM users WHERE username = $1) AS exists",
    [username],
  );

  const row = result.rows[0];

  if (!row) {
    throw new UnexpectedDatabaseResultError();
  }

  return row.exists;
};
