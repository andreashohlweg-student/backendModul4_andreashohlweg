import { AppError } from "./appError.js";

export class TweetAuthorNotFoundError extends AppError {
  constructor(options?: ErrorOptions) {
    super(409, "Tweet author does not exist", options);
  }
}
