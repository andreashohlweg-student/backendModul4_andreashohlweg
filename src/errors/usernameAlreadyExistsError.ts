import { AppError } from "./appError.js";

export class UsernameAlreadyExistsError extends AppError {
  constructor(options?: ErrorOptions) {
    super(409, "Username already exists", options);
  }
}
