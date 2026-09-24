import { AppError } from "./appError.js";

export class InvalidTweetAuthorError extends AppError {
  constructor() {
    super(400, "author must be a non-empty string of at most 50 characters");
  }
}
