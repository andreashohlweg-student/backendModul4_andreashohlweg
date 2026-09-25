import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, test } from "node:test";
import pg, { type PoolClient } from "pg";

import { translateDatabaseError } from "../src/database.js";
import { DatabaseValidationError } from "../src/errors/databaseValidationError.js";
import { TweetAuthorNotFoundError } from "../src/errors/tweetAuthorNotFoundError.js";
import { TweetTextRequiredError } from "../src/errors/tweetTextRequiredError.js";
import { UsernameAlreadyExistsError } from "../src/errors/usernameAlreadyExistsError.js";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required for database integration tests");
}

const pool = new pg.Pool({ connectionString });

after(async () => {
  await pool.end();
});

const uniqueUsername = (prefix: string): string => {
  return `${prefix}_${randomUUID().replaceAll("-", "").slice(0, 16)}`;
};

const withRollback = async (
  operation: (client: PoolClient) => Promise<void>,
): Promise<void> => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await operation(client);
  } finally {
    await client.query("ROLLBACK");
    client.release();
  }
};

const expectTranslatedError = async <ExpectedError extends Error>(
  operation: () => Promise<unknown>,
  ErrorType: new (...args: never[]) => ExpectedError,
  statusCode: number,
  message: string,
): Promise<void> => {
  await assert.rejects(operation, (databaseError: unknown) => {
    const translatedError = translateDatabaseError(databaseError);

    assert.ok(translatedError instanceof ErrorType);
    assert.equal(
      (translatedError as ExpectedError & { statusCode: number }).statusCode,
      statusCode,
    );
    assert.equal(translatedError.message, message);

    return true;
  });
};

test("translates duplicate usernames using the unique constraint name", async () => {
  await withRollback(async (client) => {
    const username = uniqueUsername("duplicate");

    await client.query(
      "INSERT INTO users (username, fullname) VALUES ($1, $2)",
      [username, "First User"],
    );

    await expectTranslatedError(
      () => client.query(
        "INSERT INTO users (username, fullname) VALUES ($1, $2)",
        [username, "Second User"],
      ),
      UsernameAlreadyExistsError,
      409,
      "Username already exists",
    );
  });
});

test("translates a missing tweet author using the foreign-key constraint name", async () => {
  await withRollback(async (client) => {
    await expectTranslatedError(
      () => client.query(
        "INSERT INTO tweets (text, author) VALUES ($1, $2)",
        ["Foreign-key test", uniqueUsername("missing")],
      ),
      TweetAuthorNotFoundError,
      409,
      "Tweet author does not exist",
    );
  });
});

test("translates whitespace-only tweet text using the check constraint name", async () => {
  await withRollback(async (client) => {
    const username = uniqueUsername("empty_text");

    await client.query(
      "INSERT INTO users (username, fullname) VALUES ($1, $2)",
      [username, "Empty Text User"],
    );

    await expectTranslatedError(
      () => client.query(
        "INSERT INTO tweets (text, author) VALUES ($1, $2)",
        ["   ", username],
      ),
      TweetTextRequiredError,
      400,
      "Text is required",
    );
  });
});

test("translates tweet text longer than the database column", async () => {
  await withRollback(async (client) => {
    const username = uniqueUsername("long_text");

    await client.query(
      "INSERT INTO users (username, fullname) VALUES ($1, $2)",
      [username, "Long Text User"],
    );

    await expectTranslatedError(
      () => client.query(
        "INSERT INTO tweets (text, author) VALUES ($1, $2)",
        ["x".repeat(281), username],
      ),
      DatabaseValidationError,
      400,
      "Data violates a database constraint",
    );
  });
});
