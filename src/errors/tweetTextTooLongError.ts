import { AppError } from "./appError.js";

export class TweetTextTooLongError extends AppError {
  constructor() {
    super(400, "Text must not exceed 280 characters");
  }
}
