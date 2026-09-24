import { AppError } from "./appError.js";

export class PasswordTooLongError extends AppError {
  constructor() {
    super(400, "Password must not exceed 128 characters");
  }
}
