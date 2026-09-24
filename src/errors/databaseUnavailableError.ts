import { AppError } from "./appError.js";

export class DatabaseUnavailableError extends AppError {
  constructor(options?: ErrorOptions) {
    super(503, "Database is temporarily unavailable", options);
  }
}
