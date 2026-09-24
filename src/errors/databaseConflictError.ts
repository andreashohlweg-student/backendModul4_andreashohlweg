import { AppError } from "./appError.js";

export class DatabaseConflictError extends AppError {
  constructor(options?: ErrorOptions) {
    super(409, "Data conflicts with an existing database record", options);
  }
}
