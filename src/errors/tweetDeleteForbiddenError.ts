import { AppError } from "./appError.js";

export class TweetDeleteForbiddenError extends AppError {
  constructor() {
    super(403, "You can only delete your own tweets");
  }
}
