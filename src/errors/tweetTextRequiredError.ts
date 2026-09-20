import { AppError } from "./appError.js";

export class TweetTextRequiredError extends AppError {
  constructor() {
    super(400, "Tweet text is required");
  }
}