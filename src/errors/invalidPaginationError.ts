import { AppError } from "./appError.js";

export class InvalidPaginationError extends AppError {
  constructor() {
    super(
      400,
      "limit and offset must be integers; limit must be 1-100 and offset at least 0",
    );
  }
}
