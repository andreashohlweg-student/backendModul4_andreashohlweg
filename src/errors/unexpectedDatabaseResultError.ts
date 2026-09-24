import { AppError } from "./appError.js";

export class UnexpectedDatabaseResultError extends AppError {
  constructor() {
    super(500, "Internal server error");
  }
}
