import { AppError } from "./appError.js";

export class UserNotFoundError extends AppError {
  constructor() {
    super(404, "User not found");
  }
}