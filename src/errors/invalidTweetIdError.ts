import { AppError } from "./appError.js";

export class InvalidTweetIdError extends AppError {
  constructor() {
    super(400, "Invalid tweet ID");
  }
}
