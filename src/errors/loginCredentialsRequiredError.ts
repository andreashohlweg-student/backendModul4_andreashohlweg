import { AppError } from "./appError.js";

export class LoginCredentialsRequiredError extends AppError {
  constructor() {
    super(400, "Username and password are required");
  }
}
