import pg from "pg";

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

