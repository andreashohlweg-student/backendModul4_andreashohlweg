import { AppError } from "./appError.js";

export class TweetTextRequiredError extends AppError {
  constructor() {
    super(400, "Text is required");
  }
}
