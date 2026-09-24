import pg from "pg";
import type { QueryResult, QueryResultRow } from "pg";
import { DatabaseConflictError } from "./errors/databaseConflictError.js";
import { DatabaseUnavailableError } from "./errors/databaseUnavailableError.js";
import { DatabaseValidationError } from "./errors/databaseValidationError.js";

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL fehlt. Kopiere .env.example nach .env und starte PostgreSQL mit npm run db:up.",
  );
}

export const pool = new Pool({ connectionString });

pool.on("error", (error) => {
  console.error("Unerwarteter PostgreSQL-Fehler", error);
});

export const checkDatabaseConnection = async (): Promise<void> => {
  await pool.query("SELECT 1");
};

type ErrorWithCode = {
  code?: unknown;
};

const getErrorCode = (error: unknown): string | undefined => {
  if (typeof error !== "object" || error === null) {
    return undefined;
  }

  const { code } = error as ErrorWithCode;

  return typeof code === "string" ? code : undefined;
};

const translateDatabaseError = (error: unknown): Error => {
  const code = getErrorCode(error);

  if (
    code?.startsWith("08")
    || code === "57P01"
    || code === "57P02"
    || code === "57P03"
    || code === "ECONNREFUSED"
    || code === "ECONNRESET"
    || code === "ETIMEDOUT"
    || code === "ENOTFOUND"
  ) {
    return new DatabaseUnavailableError({ cause: error });
  }

  if (code === "23503" || code === "23505") {
    return new DatabaseConflictError({ cause: error });
  }

  if (code === "22001" || code === "23502" || code === "23514") {
    return new DatabaseValidationError({ cause: error });
  }

  return error instanceof Error
    ? error
    : new Error("Unknown database error", { cause: error });
};

export const queryDatabase = async <Row extends QueryResultRow>(
  text: string,
  values?: unknown[],
): Promise<QueryResult<Row>> => {
  try {
    return await pool.query<Row>(text, values);
  } catch (error) {
    throw translateDatabaseError(error);
  }
};
