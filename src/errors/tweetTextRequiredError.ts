import { AppError } from "./appError.js";

export class TweetTextRequiredError extends AppError {
  constructor(options?: ErrorOptions) {
    super(400, "Text is required", options);
  }
}
