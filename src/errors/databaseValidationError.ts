import { AppError } from "./appError.js";

export class DatabaseValidationError extends AppError {
  constructor(options?: ErrorOptions) {
    super(400, "Data violates a database constraint", options);
  }
}
