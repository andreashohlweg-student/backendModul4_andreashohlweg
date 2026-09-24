import { AppError } from "./appError.js";

export class InvalidUsernameError extends AppError {
  constructor() {
    super(
      400,
      "Username must contain 1-50 lowercase letters, numbers, or underscores",
    );
  }
}
