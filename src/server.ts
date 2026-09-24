import app from "./app.js";
import { checkDatabaseConnection } from "./database.js";

const PORT = Number(process.env.PORT ?? 3000);

const startServer = async (): Promise<void> => {
  try {
    await checkDatabaseConnection();

    app.listen(PORT, () => {
      console.log(`Server läuft auf http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("PostgreSQL ist nicht erreichbar.", error);
    process.exit(1);
  }
};

void startServer();
